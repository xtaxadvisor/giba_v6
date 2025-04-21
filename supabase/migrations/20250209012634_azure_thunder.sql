/*
  # Fix Policy and Add Improvements
  
  1. Changes
    - Drop and recreate client policies properly
    - Add improved error handling
    - Add transaction safety
  
  2. Security
    - Maintains existing security model
    - Adds additional safety checks
*/

BEGIN;

-- Safely drop existing policy
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

-- Create new improved policy
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
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.role IN ('professional', 'admin')
        )
      );
  END IF;
END $$;

-- Verify policy was created
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'clients' 
      AND policyname = 'Professionals can view all clients'
  ) THEN
    RAISE EXCEPTION 'Policy creation failed';
  END IF;
END $$;

COMMIT;