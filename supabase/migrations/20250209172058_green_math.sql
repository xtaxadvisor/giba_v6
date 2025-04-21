-- First, safely remove any existing policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Professionals can view all clients" ON clients;
  DROP POLICY IF EXISTS "Clients can view own data" ON clients;
  DROP POLICY IF EXISTS "Users can view their consultations" ON consultations;
  DROP POLICY IF EXISTS "Users can view their documents" ON documents;
  DROP POLICY IF EXISTS "Users can upload documents" ON documents;
  DROP POLICY IF EXISTS "Users can view their messages" ON messages;
  DROP POLICY IF EXISTS "Users can send messages" ON messages;
END $$;

-- Re-create policies with unique names
CREATE POLICY "client_view_policy_professional"
  ON clients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('professional', 'admin')
    )
  );

CREATE POLICY "client_view_policy_self"
  ON clients FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "consultation_view_policy"
  ON consultations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients WHERE clients.id = client_id AND clients.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM professionals WHERE professionals.id = professional_id AND professionals.user_id = auth.uid()
    )
  );

CREATE POLICY "document_view_policy"
  ON documents FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "document_insert_policy"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "message_view_policy"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "message_insert_policy"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());