/*
  # Fix Duplicate Policy Issue

  1. Changes
    - Drop existing "Professionals can view all clients" policy
    - Recreate policy with correct permissions
  
  2. Security
    - Maintains existing RLS security model
    - No data modifications
*/

-- First drop the existing policy if it exists
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
END $$;

-- Recreate the policy with correct permissions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'clients' 
      AND policyname = 'Professionals can view all clients'
  ) THEN
    CREATE POLICY "Professionals can view all clients"
      ON clients FOR SELECT
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('professional', 'admin')
      ));
  END IF;
END $$;