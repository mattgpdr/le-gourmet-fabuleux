-- Fix profiles table RLS policy to protect email addresses
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix user_roles table RLS policy to hide role assignments
DROP POLICY IF EXISTS "User roles are viewable by everyone" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add storage policies for gallery bucket
CREATE POLICY "Anyone can view gallery images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Only admins can upload gallery images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gallery' AND
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Only admins can update gallery images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'gallery' AND
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Only admins can delete gallery images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gallery' AND
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Add database constraints for data validation
ALTER TABLE reservations 
  ADD CONSTRAINT customer_name_length CHECK (length(customer_name) > 0 AND length(customer_name) <= 100),
  ADD CONSTRAINT customer_email_length CHECK (length(customer_email) <= 255),
  ADD CONSTRAINT customer_phone_length CHECK (customer_phone IS NULL OR length(customer_phone) <= 20),
  ADD CONSTRAINT message_length CHECK (message IS NULL OR length(message) <= 1000),
  ADD CONSTRAINT number_of_guests_range CHECK (number_of_guests >= 1 AND number_of_guests <= 20);

ALTER TABLE reviews 
  ADD CONSTRAINT author_name_length CHECK (length(author_name) > 0 AND length(author_name) <= 100),
  ADD CONSTRAINT comment_length CHECK (length(comment) >= 10 AND length(comment) <= 1000),
  ADD CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE menu_items
  ADD CONSTRAINT menu_name_length CHECK (length(name) > 0 AND length(name) <= 100),
  ADD CONSTRAINT menu_description_length CHECK (description IS NULL OR length(description) <= 500),
  ADD CONSTRAINT price_range CHECK (price > 0 AND price < 10000);