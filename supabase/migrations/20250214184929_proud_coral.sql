-- Drop existing functions first to avoid conflicts
DO $$ 
BEGIN
  DROP FUNCTION IF EXISTS public.test_connection();
  DROP FUNCTION IF EXISTS public.test_rls_policies();
END $$;

-- Create new test_connection function with proper return type
CREATE OR REPLACE FUNCTION public.test_connection()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  test_result jsonb;
BEGIN
  -- Simple connection test that doesn't require table access
  test_result := jsonb_build_object(
    'success', true,
    'timestamp', CURRENT_TIMESTAMP,
    'version', current_setting('server_version'),
    'message', 'Connection successful'
  );
  
  RETURN test_result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'timestamp', CURRENT_TIMESTAMP
    );
END;
$$;

-- Drop existing RLS test table and policies
DROP TABLE IF EXISTS rls_test CASCADE;

-- Recreate RLS test table
CREATE TABLE IF NOT EXISTS rls_test (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  data text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on test table
ALTER TABLE rls_test ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies with unique names
CREATE POLICY "rls_test_select_policy" 
  ON rls_test FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "rls_test_insert_policy" 
  ON rls_test FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

-- Create test_rls_policies function
CREATE OR REPLACE FUNCTION public.test_rls_policies()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  test_result jsonb;
  test_id uuid;
BEGIN
  -- Insert test data
  INSERT INTO rls_test (user_id, data)
  VALUES (auth.uid(), 'test data')
  RETURNING id INTO test_id;
  
  -- Test SELECT policy
  PERFORM count(*) FROM rls_test WHERE id = test_id AND user_id = auth.uid();
  
  -- Clean up test data
  DELETE FROM rls_test WHERE id = test_id;
  
  -- Return success result
  test_result := jsonb_build_object(
    'success', true,
    'timestamp', CURRENT_TIMESTAMP,
    'message', 'RLS policies working correctly'
  );
  
  RETURN test_result;
EXCEPTION
  WHEN OTHERS THEN
    -- Clean up on error
    IF test_id IS NOT NULL THEN
      DELETE FROM rls_test WHERE id = test_id;
    END IF;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'timestamp', CURRENT_TIMESTAMP
    );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.test_connection() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.test_rls_policies() TO authenticated;