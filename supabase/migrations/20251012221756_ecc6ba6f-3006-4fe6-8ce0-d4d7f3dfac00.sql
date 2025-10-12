-- Create table for reservations
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  number_of_guests INTEGER NOT NULL DEFAULT 2,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'confirmed'
);

-- Enable Row Level Security
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert reservations" ON public.reservations;
DROP POLICY IF EXISTS "Reservations are viewable by admins only" ON public.reservations;
DROP POLICY IF EXISTS "Only admins can delete reservations" ON public.reservations;

-- Create policies for reservations
CREATE POLICY "Anyone can insert reservations"
ON public.reservations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Reservations are viewable by admins only"
ON public.reservations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete reservations"
ON public.reservations
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create table for available time slots configuration
CREATE TABLE IF NOT EXISTS public.opening_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_closed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(day_of_week)
);

-- Enable RLS
ALTER TABLE public.opening_hours ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Opening hours are viewable by everyone" ON public.opening_hours;
DROP POLICY IF EXISTS "Only admins can manage opening hours" ON public.opening_hours;

-- Policies for opening hours
CREATE POLICY "Opening hours are viewable by everyone"
ON public.opening_hours
FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage opening hours"
ON public.opening_hours
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create table for gallery images
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  category TEXT NOT NULL DEFAULT 'plats',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Gallery images are viewable by everyone" ON public.gallery_images;
DROP POLICY IF EXISTS "Only admins can manage gallery images" ON public.gallery_images;

-- Policies for gallery images
CREATE POLICY "Gallery images are viewable by everyone"
ON public.gallery_images
FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage gallery images"
ON public.gallery_images
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Gallery images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete gallery images" ON storage.objects;

-- Storage policies for gallery bucket
CREATE POLICY "Gallery images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete gallery images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));