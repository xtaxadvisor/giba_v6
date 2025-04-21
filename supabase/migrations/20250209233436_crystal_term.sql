-- First drop all existing test functions
DO $$ 
BEGIN
  DROP FUNCTION IF EXISTS public.test_connection();
  DROP FUNCTION IF EXISTS public.test_rls();
  DROP FUNCTION IF EXISTS public.test_rls_policies();
END $$;

-- Create new test_connection function with proper return type
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