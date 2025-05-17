import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase/client';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    console.log('🟡 Attempting login with:', { email, passwordLength: password.length });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('❌ Login failed:', error.message);
      setErrorMsg(error.message);
      return;
    }

    console.log('🧾 Supabase login response:', data, error);

    if (!data?.user) {
      console.warn('⚠️ Login succeeded but no user returned.');
      setErrorMsg('Unexpected login response. Please try again.');
      return;
    }

    console.log('✅ Login success:', data.user);
    window.location.href = '/select-role'; // force hydration and redirect
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {errorMsg && <div className="text-red-600 mb-2">{errorMsg}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;