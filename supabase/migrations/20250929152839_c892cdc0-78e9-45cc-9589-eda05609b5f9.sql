-- Create quiz_sessions table to store user quiz attempts
CREATE TABLE public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  twitter_username TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 15,
  completion_time INTEGER NOT NULL, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access for leaderboard
CREATE POLICY "Anyone can view quiz sessions" 
ON public.quiz_sessions 
FOR SELECT 
USING (true);

-- Create policy to allow public insert for quiz completion
CREATE POLICY "Anyone can insert quiz sessions" 
ON public.quiz_sessions 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster leaderboard queries
CREATE INDEX idx_quiz_sessions_score_time ON public.quiz_sessions (score DESC, completion_time ASC, completed_at DESC);

-- Enable realtime for quiz_sessions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_sessions;

-- Create function to clean up old leaderboard entries (older than 30 minutes)
CREATE OR REPLACE FUNCTION public.cleanup_old_quiz_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.quiz_sessions 
  WHERE completed_at < NOW() - INTERVAL '30 minutes';
END;
$$;

-- Create function to get current leaderboard
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