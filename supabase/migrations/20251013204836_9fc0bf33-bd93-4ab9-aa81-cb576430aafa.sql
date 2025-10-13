-- Ajouter le champ is_processed pour les réservations
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS is_processed boolean NOT NULL DEFAULT false;

-- Mettre à jour la politique RLS pour permettre aux admins de modifier le statut
CREATE POLICY "Admins can update reservations status"
ON public.reservations
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));