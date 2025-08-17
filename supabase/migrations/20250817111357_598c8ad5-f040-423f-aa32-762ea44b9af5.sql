-- Create a helper function to validate that a given profile_id belongs to the current auth user
CREATE OR REPLACE FUNCTION public.profile_belongs_to_current_user(p_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = p_profile_id AND p.user_id = auth.uid()
  );
$$;

-- Update RLS policies on stones to align with creator_id referencing profiles.id
-- Keep public SELECT policy unchanged

-- Replace INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create stones" ON public.stones;
CREATE POLICY "Authenticated users can create stones"
ON public.stones
FOR INSERT
TO authenticated
WITH CHECK (public.profile_belongs_to_current_user(creator_id));

-- Replace UPDATE policy for consistency
DROP POLICY IF EXISTS "Users can update their own stones" ON public.stones;
CREATE POLICY "Users can update their own stones"
ON public.stones
FOR UPDATE
USING (public.profile_belongs_to_current_user(creator_id));

-- Replace DELETE policy for consistency
DROP POLICY IF EXISTS "Users can delete their own stones" ON public.stones;
CREATE POLICY "Users can delete their own stones"
ON public.stones
FOR DELETE
USING (public.profile_belongs_to_current_user(creator_id));