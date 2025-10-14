-- Create a secure server-side function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT has_role(auth.uid(), 'admin'::app_role)
$$;