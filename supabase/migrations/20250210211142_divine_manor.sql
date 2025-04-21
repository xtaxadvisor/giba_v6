-- Create SAML configuration table
CREATE TABLE IF NOT EXISTS saml_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text NOT NULL,
  entity_id text NOT NULL UNIQUE,
  metadata_xml text NOT NULL,
  attribute_mapping jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create SAML user mapping table
CREATE TABLE IF NOT EXISTS saml_user_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  provider_id uuid REFERENCES saml_providers(id),
  external_id text NOT NULL,
  attributes jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(provider_id, external_id)
);

-- Enable RLS
ALTER TABLE saml_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE saml_user_mappings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Only admins can manage SAML providers"
  ON saml_providers
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can view their own SAML mappings"
  ON saml_user_mappings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to handle SAML user creation/update
CREATE OR REPLACE FUNCTION handle_saml_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create or update user profile
  INSERT INTO users (auth_id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  )
  ON CONFLICT (auth_id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = now();
    
  RETURN NEW;
END;
$$;

-- Create trigger for SAML user handling
DROP TRIGGER IF EXISTS on_saml_user_auth ON auth.users;
CREATE TRIGGER on_saml_user_auth
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_user_meta_data->>'provider' = 'saml')
  EXECUTE FUNCTION handle_saml_user();