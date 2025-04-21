-- First safely drop the existing policy if it exists
DO $$ 
BEGIN
  -- Drop the policy if it exists
  IF EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'clients' 
      AND policyname = 'Professionals can view all clients'
  ) THEN
    DROP POLICY IF EXISTS "Professionals can view all clients" ON clients;
  END IF;

  -- Create new policy with a different name to avoid conflicts
  CREATE POLICY "professionals_view_clients_policy"
    ON clients FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('professional', 'admin')
      )
    );
END $$;