-- First drop existing function and policies
DO $$ 
BEGIN
  -- Drop existing function
  DROP FUNCTION IF EXISTS public.test_connection();

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Allow authenticated access to professionals" ON professionals;
  DROP POLICY IF EXISTS "Allow professionals to manage their own data" ON professionals;
END $$;

-- Create new test_connection function with consistent return type
CREATE OR REPLACE FUNCTION public.test_connection()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Simple connection test
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

-- Ensure RLS is enabled on professionals table
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

-- Create new policies with unique names
CREATE POLICY "professionals_authenticated_access_policy"
  ON professionals
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "professionals_own_data_policy"
  ON professionals
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());