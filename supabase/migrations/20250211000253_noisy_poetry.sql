-- First drop the existing function
DROP FUNCTION IF EXISTS public.test_connection();

-- Create new test_connection function with proper return type
CREATE OR REPLACE FUNCTION public.test_connection()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  connection_test jsonb;
BEGIN
  -- Simple connection test that doesn't require table access
  connection_test := jsonb_build_object(
    'success', true,
    'timestamp', CURRENT_TIMESTAMP,
    'version', current_setting('server_version'),
    'message', 'Connection successful'
  );

  -- Test basic query capability
  PERFORM current_timestamp;

  RETURN connection_test;
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

-- Verify function exists with correct return type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_proc 
    WHERE proname = 'test_connection' 
    AND prorettype = 'jsonb'::regtype
  ) THEN
    RAISE EXCEPTION 'Function test_connection was not created correctly';
  END IF;
END $$;