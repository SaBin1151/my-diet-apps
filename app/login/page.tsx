'use client';

import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 로그인 (Sign In)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard'); // 로그인 성공 시 대시보드로 이동
      router.refresh();
    }
  };

  // 회원가입 (Sign Up)
  const handleSignUp = async () => {
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Confirmation email sent! Check your inbox.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Welcome Back</h1>
      
      <form onSubmit={handleLogin} className="card">
        <div style={{ marginBottom: '16px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#666', marginBottom: '8px' }}>EMAIL</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #e5e5e5', borderRadius: '6px' }}
          />
        </div>

        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#666', marginBottom: '8px' }}>PASSWORD</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #e5e5e5', borderRadius: '6px' }}
          />
        </div>

        {message && <p style={{ color: 'red', fontSize: '0.875rem', marginBottom: '16px' }}>{message}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary" 
          style={{ width: '100%', marginBottom: '12px' }}
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>

        <button 
          type="button" 
          onClick={handleSignUp}
          disabled={loading}
          style={{ 
            background: 'none', border: 'none', color: '#666', 
            textDecoration: 'underline', cursor: 'pointer', fontSize: '0.875rem' 
          }}
        >
          No account? Sign Up
        </button>
      </form>
    </div>
  );
}