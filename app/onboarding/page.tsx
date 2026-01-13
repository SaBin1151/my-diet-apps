'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // 입력값 상태 관리
  const [formData, setFormData] = useState({
    height: '',
    age: '',
    gender: 'Male',
    currentWeight: '',
    goalWeight: '',
    activityLevel: '1-2 days', // 텍스트로 저장
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // 1. 프로필 정보 저장 (profiles 테이블)
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        height: parseFloat(formData.height),
        age: parseFloat(formData.age),
        gender: formData.gender,
        goal_weight: parseFloat(formData.goalWeight),
        activity_level: formData.activityLevel,
      });
      if (profileError) throw profileError;

      // 2. 초기 몸무게 기록 (weight_logs 테이블)
      if (formData.currentWeight) {
        const { error: logError } = await supabase.from('weight_logs').insert({
          user_id: user.id,
          weight: parseFloat(formData.currentWeight)
        });
        if (logError) throw logError;
      }

      // 성공 시 대시보드로 이동
      router.push('/dashboard');

    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ marginBottom: 'var(--space-sm)' }}>Let's set up your plan</h1>
        <p>We need a few details to calculate your calorie targets.</p>
      </div>

      <div className="card">
        <h2 className="card-title">Body Stats</h2>
        <div className="grid-2">
          <div>
            <label style={labelStyle}>HEIGHT (CM)</label>
            <input id="height" type="number" placeholder="175" style={inputStyle} onChange={handleChange} />
          </div>
          <div>
            <label style={labelStyle}>AGE</label>
            <input id="age" type="number" placeholder="25" style={inputStyle} onChange={handleChange} />
          </div>
        </div>
        <div className="grid-2" style={{ marginTop: 'var(--space-md)' }}>
          <div>
            <label style={labelStyle}>GENDER</label>
            <select id="gender" style={inputStyle} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>CURRENT WEIGHT (KG)</label>
            <input id="currentWeight" type="number" placeholder="75.0" step="0.1" style={inputStyle} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Goal</h2>
        <div>
          <label style={labelStyle}>GOAL WEIGHT (KG)</label>
          <input id="goalWeight" type="number" placeholder="68.0" step="0.1" style={inputStyle} onChange={handleChange} />
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Activity</h2>
        <div>
          <label style={labelStyle}>WORKOUT DAYS / WEEK</label>
          <select id="activityLevel" style={inputStyle} onChange={handleChange}>
            <option value="0 (Sedentary)">0 (Sedentary)</option>
            <option value="1-2 days">1-2 days</option>
            <option value="3-4 days">3-4 days</option>
            <option value="5+ days">5+ days</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center' }}>
        <button className="btn-primary" style={{ width: '100%' }} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Setting up...' : 'Calculate Plan & Continue'}
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', fontSize: '1rem', border: '1px solid var(--border-subtle)', borderRadius: '6px', outline: 'none' };