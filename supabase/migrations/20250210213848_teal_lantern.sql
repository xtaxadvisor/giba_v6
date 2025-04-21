-- Drop existing test_connection function
DROP FUNCTION IF EXISTS public.test_connection();

-- Create new test_connection function with consistent return type
CREATE OR REPLACE FUNCTION public.test_connection()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Simple connection test that doesn't require table access
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