-- Fix search_path security warnings by updating functions
CREATE OR REPLACE FUNCTION public.cleanup_old_quiz_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.quiz_sessions 
  WHERE completed_at < NOW() - INTERVAL '30 minutes';
END;
$$;

CREATE OR REPLACE FUNCTION public.get_current_leaderboard()
RETURNS TABLE (
  rank BIGINT,
  twitter_username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  score INTEGER,
  completion_time INTEGER,
  time_display TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY qs.score DESC, qs.completion_time ASC, qs.completed_at ASC) as rank,
    qs.twitter_username,
    qs.display_name,
    qs.avatar_url,
    qs.score,
    qs.completion_time,
    (qs.completion_time / 60)::text || 'm ' || (qs.completion_time % 60)::text || 's' as time_display
  FROM public.quiz_sessions qs
  WHERE qs.completed_at > NOW() - INTERVAL '30 minutes'
  ORDER BY qs.score DESC, qs.completion_time ASC, qs.completed_at ASC
  LIMIT 50;
END;
$$;