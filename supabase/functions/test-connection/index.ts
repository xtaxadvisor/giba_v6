/// <reference no-default-lib="true" />
// Removed the reference to 'deno.ns' as it is not recognized and not required
// Removed the reference to 'deno.unstable' as it is not recognized
// Removed duplicate import of createServer
// Removed unnecessary import of Response as it is globally available in Deno
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
import { createServer } from 'http';

// Removed duplicate server declaration
const server = createServer(async (req, res) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end('ok');
    return;
  }

  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase environment variables');
    }
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    const { data, error } = await supabase.rpc('test_connection');  
    if (error) {
      throw error;
    }
    res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, data }));
  } catch (error) {
    console.error('Connection test error:', error);
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: error.message || 'Connection test failed'
    }));
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});