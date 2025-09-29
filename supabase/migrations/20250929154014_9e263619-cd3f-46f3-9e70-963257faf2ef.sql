-- Update default total_questions to 10
ALTER TABLE public.quiz_sessions ALTER COLUMN total_questions SET DEFAULT 10;