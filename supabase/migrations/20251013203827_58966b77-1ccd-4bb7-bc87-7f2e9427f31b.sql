-- Drop unique constraint on day_of_week if it exists
ALTER TABLE public.opening_hours DROP CONSTRAINT IF EXISTS opening_hours_day_of_week_key;

-- Insert default opening hours for lunch service (12:00-14:30) for Monday to Saturday
INSERT INTO public.opening_hours (day_of_week, start_time, end_time, is_closed)
VALUES 
  (1, '12:00:00', '14:30:00', false),
  (2, '12:00:00', '14:30:00', false),
  (3, '12:00:00', '14:30:00', false),
  (4, '12:00:00', '14:30:00', false),
  (5, '12:00:00', '14:30:00', false),
  (6, '12:00:00', '14:30:00', false);

-- Insert default opening hours for dinner service (19:00-22:30) for Monday to Saturday
INSERT INTO public.opening_hours (day_of_week, start_time, end_time, is_closed)
VALUES 
  (1, '19:00:00', '22:30:00', false),
  (2, '19:00:00', '22:30:00', false),
  (3, '19:00:00', '22:30:00', false),
  (4, '19:00:00', '22:30:00', false),
  (5, '19:00:00', '22:30:00', false),
  (6, '19:00:00', '22:30:00', false);

-- Sunday closed
INSERT INTO public.opening_hours (day_of_week, start_time, end_time, is_closed)
VALUES (0, '00:00:00', '00:00:00', true);