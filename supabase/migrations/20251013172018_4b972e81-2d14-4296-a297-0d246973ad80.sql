-- Table pour les messages de contact
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table pour les paramètres du site (hero image, etc.)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table pour la FAQ du chat
CREATE TABLE public.faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ajouter champ is_visible à gallery_images
ALTER TABLE public.gallery_images 
ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;

-- Ajouter champ is_viewed à reservations
ALTER TABLE public.reservations 
ADD COLUMN is_viewed BOOLEAN NOT NULL DEFAULT false;

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour contact_messages
CREATE POLICY "Anyone can insert contact messages"
ON public.contact_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can view contact messages"
ON public.contact_messages FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update contact messages"
ON public.contact_messages FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete contact messages"
ON public.contact_messages FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies pour site_settings
CREATE POLICY "Everyone can view site settings"
ON public.site_settings FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage site settings"
ON public.site_settings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies pour faq_items
CREATE POLICY "Everyone can view active FAQ items"
ON public.faq_items FOR SELECT
USING (is_active = true);

CREATE POLICY "Only admins can manage FAQ items"
ON public.faq_items FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insérer l'image hero par défaut
INSERT INTO public.site_settings (key, value)
VALUES ('hero_image_url', '/src/assets/hero-restaurant.jpg');

-- Insérer quelques questions FAQ par défaut
INSERT INTO public.faq_items (question, answer, display_order) VALUES
('Quels sont vos horaires d''ouverture ?', 'Nous sommes ouverts du lundi au vendredi de 7h à 23h, le samedi de 8h à 23h et le dimanche de 9h à 22h.', 1),
('Puis-je réserver en ligne ?', 'Oui ! Utilisez notre formulaire de réservation en ligne ou appelez-nous au 01 23 45 67 89.', 2),
('Proposez-vous des menus végétariens ?', 'Oui, nous proposons plusieurs options végétariennes et véganes. N''hésitez pas à nous en faire part lors de votre réservation.', 3),
('Où êtes-vous situé ?', 'Nous sommes situés au 123 Avenue des Champs-Élysées, 75008 Paris, France.', 4);