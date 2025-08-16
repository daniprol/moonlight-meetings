-- Create the main application tables for the stones dating app

-- First, update the profiles table to include username
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username text UNIQUE;

-- Create stones table for dating places (using lat/lng instead of geography for now)
CREATE TABLE public.stones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  latitude double precision,
  longitude double precision,
  address_text text,
  creator_id uuid NOT NULL,
  average_rating float DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_stones_creator FOREIGN KEY (creator_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create reviews table
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stone_id uuid NOT NULL,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_reviews_stone FOREIGN KEY (stone_id) REFERENCES public.stones(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  UNIQUE(stone_id, user_id) -- One review per user per stone
);

-- Create photos table
CREATE TABLE public.photos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stone_id uuid NOT NULL,
  uploader_id uuid NOT NULL,
  storage_path text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_photos_stone FOREIGN KEY (stone_id) REFERENCES public.stones(id) ON DELETE CASCADE,
  CONSTRAINT fk_photos_uploader FOREIGN KEY (uploader_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create favorites table
CREATE TABLE public.favorites (
  user_id uuid NOT NULL,
  stone_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, stone_id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_stone FOREIGN KEY (stone_id) REFERENCES public.stones(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE public.stones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stones
CREATE POLICY "Anyone can view stones" 
ON public.stones FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create stones" 
ON public.stones FOR INSERT 
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own stones" 
ON public.stones FOR UPDATE 
USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own stones" 
ON public.stones FOR DELETE 
USING (auth.uid() = creator_id);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for photos
CREATE POLICY "Anyone can view photos" 
ON public.photos FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can upload photos" 
ON public.photos FOR INSERT 
WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Users can delete their own photos" 
ON public.photos FOR DELETE 
USING (auth.uid() = uploader_id);

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites" 
ON public.favorites FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" 
ON public.favorites FOR ALL 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_stones_location ON public.stones (latitude, longitude);
CREATE INDEX idx_stones_creator ON public.stones (creator_id);
CREATE INDEX idx_stones_rating ON public.stones (average_rating DESC);
CREATE INDEX idx_reviews_stone ON public.reviews (stone_id);
CREATE INDEX idx_reviews_user ON public.reviews (user_id);
CREATE INDEX idx_photos_stone ON public.photos (stone_id);
CREATE INDEX idx_favorites_user ON public.favorites (user_id);

-- Add updated_at trigger for stones
CREATE TRIGGER update_stones_updated_at
  BEFORE UPDATE ON public.stones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update stone average rating
CREATE OR REPLACE FUNCTION public.update_stone_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.stones 
  SET average_rating = (
    SELECT COALESCE(AVG(rating), 0) 
    FROM public.reviews 
    WHERE stone_id = COALESCE(NEW.stone_id, OLD.stone_id)
  )
  WHERE id = COALESCE(NEW.stone_id, OLD.stone_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to update stone rating when reviews change
CREATE TRIGGER update_stone_rating_on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_stone_rating();

-- Create storage bucket for stone photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('stone-photos', 'stone-photos', true);

-- Storage policies for stone photos
CREATE POLICY "Anyone can view stone photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'stone-photos');

CREATE POLICY "Authenticated users can upload stone photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'stone-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own stone photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'stone-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own stone photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'stone-photos' AND auth.uid()::text = (storage.foldername(name))[1]);