'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LogPage() {
  const router = useRouter();
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  // 페이지 로드 시 로그인 체크 (로그인 안 했으면 튕겨내기)
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/login');
    };
    checkUser();
  }, [router]);

  const handleSave = async () => {
    if (!weight) return;
    setLoading(true);

    try {
      // 1. 현재 로그인한 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not logged in');

      // 2. Supabase 테이블(weight_logs)에 데이터 저장
      const { error } = await supabase.from('weight_logs').insert({
        user_id: user.id,        // 내 아이디
        weight: parseFloat(weight) // 입력한 몸무게 (숫자로 변환)
      });

      if (error) throw error;

      // 3. 성공 시 대시보드로 이동
      router.push('/dashboard');
      router.refresh(); // 데이터 갱신

    } catch (error: any) {
      alert('Error saving weight: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', textAlign: 'center' }}>
      <h1 style={{ marginBottom: 'var(--space-xl)', fontSize: '1.5rem' }}>
        Log Weight
      </h1>

      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--space-sm)', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
          TODAY'S WEIGHT (KG)
        </label>
        
        <input 
          type="number" 
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="0.0" 
          step="0.1"
          autoFocus
          style={{
            width: '100%', padding: '16px', fontSize: '2rem', fontWeight: '700',
            textAlign: 'center', border: '1px solid var(--border-subtle)',
            borderRadius: '8px', outline: 'none', color: 'var(--text-main)',
            backgroundColor: 'var(--bg-card)'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="btn-primary" 
          style={{ width: '100%', padding: '16px' }}
        >
          {loading ? 'Saving...' : 'Save Entry'}
        </button>

        <Link href="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', padding: '8px' }}>
          Cancel
        </Link>
      </div>
    </div>
  );
}