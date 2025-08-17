-- Add thumbnail fields to photos table
ALTER TABLE public.photos 
ADD COLUMN thumbnail_path text,
ADD COLUMN thumbnail_width integer,
ADD COLUMN thumbnail_height integer;

-- Create storage bucket for thumbnails if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('stone-thumbnails', 'stone-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for thumbnail storage
CREATE POLICY "Anyone can view thumbnails" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'stone-thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'stone-thumbnails' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own thumbnails" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'stone-thumbnails' AND auth.uid() IS NOT NULL);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_photos_stone_id_thumbnail ON public.photos(stone_id, thumbnail_path) WHERE thumbnail_path IS NOT NULL;