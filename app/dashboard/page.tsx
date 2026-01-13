'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [profile, setProfile] = useState<any>(null);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (!profileData) { router.push('/onboarding'); return; }
      setProfile(profileData);

      // 최신 몸무게 1개만 가져옴
      const { data: logs } = await supabase
        .from('weight_logs')
        .select('weight')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (logs && logs.length > 0) setCurrentWeight(logs[0].weight);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Running simulation...</div>;

  // --- Quant Simulation Logic ---

  // 1. TDEE (Total Daily Energy Expenditure) 계산
  const isMale = profile.gender === 'Male';
  const calcWeight = currentWeight || 70;
  // Mifflin-St Jeor Equation (가장 정확도가 높음)
  const bmr = (10 * calcWeight) + (6.25 * profile.height) - (5 * profile.age) + (isMale ? 5 : -161);
  
  let activityMultiplier = 1.2; // Sedentary
  if (profile.activity_level === '1-2 days') activityMultiplier = 1.375;
  if (profile.activity_level === '3-4 days') activityMultiplier = 1.55;
  if (profile.activity_level === '5+ days') activityMultiplier = 1.725;
  
  const tdee = Math.round(bmr * activityMultiplier); // 유지 칼로리

  // 2. 감량 시뮬레이션 시나리오 (1kg 지방 = 약 7700kcal)
  const weightToLose = calcWeight - profile.goal_weight;
  const totalCalorieDeficitNeeded = weightToLose * 7700;

  // 시나리오 정의
  const scenarios = [
    { label: "Slow & Steady", deficit: 300, color: "var(--text-main)" },
    { label: "Standard", deficit: 500, color: "var(--primary)" },
    { label: "Aggressive", deficit: 800, color: "#ef4444" },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Dashboard</h1>
        <Link href="/trends" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
          View Trends →
        </Link>
      </div>

      {/* 1. Base Stats */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>MAINTENANCE (TDEE)</p>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: 'var(--space-sm)' }}>
            {tdee} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>kcal</span>
          </div>
          <p style={{ marginTop: 'var(--space-sm)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Calories to maintain {calcWeight}kg
          </p>
        </div>

        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>REMAINING WEIGHT</p>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: 'var(--space-sm)', color: 'var(--text-main)' }}>
            {weightToLose.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>kg</span>
          </div>
          <p style={{ marginTop: 'var(--space-sm)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Goal: {profile.goal_weight}kg
          </p>
        </div>
      </div>

      {/* 2. Simulation Table */}
      <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-md)', fontWeight: 700 }}>Projection Scenarios</h2>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: '#f9fafb' }}>
              <th style={{ textAlign: 'left', padding: '16px', color: 'var(--text-muted)' }}>STRATEGY</th>
              <th style={{ textAlign: 'right', padding: '16px', color: 'var(--text-muted)' }}>DAILY EAT</th>
              <th style={{ textAlign: 'right', padding: '16px', color: 'var(--text-muted)' }}>EST. TIME</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s) => {
              const days = Math.ceil(totalCalorieDeficitNeeded / s.deficit);
              const targetDate = new Date();
              targetDate.setDate(targetDate.getDate() + days);
              
              return (
                <tr key={s.label} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '16px', fontWeight: 600, color: s.color }}>
                    {s.label} <br/>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(-{s.deficit} kcal)</span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700 }}>
                    {tdee - s.deficit} kcal
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>{days} Days</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      by {targetDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center' }}>
        <Link href="/log">
          <button className="btn-primary" style={{ width: '100%' }}>
            Log Today's Weight
          </button>
        </Link>
      </div>
    </div>
  );
}