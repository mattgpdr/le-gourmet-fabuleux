-- Add image_url and detailed description to menu_items
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS detailed_description TEXT;

-- Add is_confirmed to reviews table
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS is_confirmed BOOLEAN NOT NULL DEFAULT false;

-- Create or update site_settings for new fields
INSERT INTO public.site_settings (key, value) VALUES
  ('logo_url', ''),
  ('instagram_url', 'https://instagram.com'),
  ('facebook_url', 'https://facebook.com'),
  ('phone', '01 23 45 67 89'),
  ('email', 'contact@legourmetparisien.fr'),
  ('address', '123 Avenue des Champs-Élysées, 75008 Paris, France'),
  ('map_query', 'Champs-Élysées+Paris')
ON CONFLICT (key) DO NOTHING;