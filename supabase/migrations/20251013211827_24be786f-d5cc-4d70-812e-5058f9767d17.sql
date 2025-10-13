-- Add UPDATE policy for reviews table to allow admins to confirm/update reviews
CREATE POLICY "Admins can update reviews"
ON public.reviews
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));