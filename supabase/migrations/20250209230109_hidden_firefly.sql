-- Drop existing test functions
DROP FUNCTION IF EXISTS public.test_connection();

-- Create new test_connection function
CREATE OR REPLACE FUNCTION public.test_connection()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Test basic connectivity
  PERFORM count(*) FROM users LIMIT 1;
  
  RETURN jsonb_build_object(
    'success', true,
    'timestamp', CURRENT_TIMESTAMP,
    'version', current_setting('server_version'),
    'message', 'Connection successful'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'timestamp', CURRENT_TIMESTAMP
    );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.test_connection() TO authenticated, anon;

-- Create public_data table if it doesn't exist
CREATE TABLE IF NOT EXISTS public_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on public_data
ALTER TABLE public_data ENABLE ROW LEVEL SECURITY;

-- Allow public read access to public_data
CREATE POLICY "Allow public read access to public_data"
  ON public_data
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert test data
INSERT INTO public_data (title, content)
VALUES ('Welcome', 'Welcome to ProTaXAdvisors')
ON CONFLICT DO NOTHING;