'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Supabase 클라이언트 설정
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // 데이터 상태 관리
  const [profile, setProfile] = useState<any>(null);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [startWeight, setStartWeight] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // 1. 현재 로그인한 사용자 확인
      const { data: { user } } = await supabase.auth.getUser();
      
      // 로그인이 안 되어 있다면 로그인 페이지로 보냄
      if (!user) {
        router.push('/login');
        return;
      }

      // 2. 프로필 정보 가져오기 (profiles 테이블)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      // [핵심 기능] 프로필이 없으면 온보딩 페이지로 강제 이동 (납치)
      if (!profileData) {
        router.push('/onboarding');
        return;
      }
      setProfile(profileData);

      // 3. 몸무게 기록 가져오기 (weight_logs 테이블) - 최신순 정렬
      const { data: logs } = await supabase
        .from('weight_logs')
        .select('weight')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (logs && logs.length > 0) {
        setCurrentWeight(logs[0].weight); // 가장 최근 기록 (현재)
        setStartWeight(logs[logs.length - 1].weight); // 가장 마지막 기록 (시작)
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);

  // 로딩 화면
  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading dashboard...
      </div>
    );
  }

  // -- 계산 로직 (기초대사량 BMR 및 목표 칼로리) --
  // 남성: 10*W + 6.25*H - 5*A + 5
  // 여성: 10*W + 6.25*H - 5*A - 161
  const isMale = profile.gender === 'Male';
  // 몸무게 정보가 없으면 기본값 70kg로 계산 방지
  const calcWeight = currentWeight || 70; 
  const bmr = (10 * calcWeight) + (6.25 * profile.height) - (5 * profile.age) + (isMale ? 5 : -161);
  
  // 활동량에 따른 계수 (단순화: 기본 1.2 + 운동량 반영)
  let activityMultiplier = 1.2;
  if (profile.activity_level === '3-4 days') activityMultiplier = 1.375;
  if (profile.activity_level === '5+ days') activityMultiplier = 1.55;

  const dailyTarget = Math.round(bmr * activityMultiplier);

  // 체중 변화량 및 남은 체중 계산
  const weightChange = currentWeight && startWeight ? (currentWeight - startWeight).toFixed(1) : '0.0';
  const remaining = currentWeight ? (currentWeight - profile.goal_weight).toFixed(1) : '0.0';

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-lg)' }}>
        Today's Overview
      </h1>

      <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
        {/* Status Card */}
        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>STATUS</p>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 'var(--space-sm)', color: 'var(--primary)' }}>
            ON TRACK
          </div>
          <p style={{ marginTop: 'var(--space-sm)', color: 'var(--text-main)' }}>
            Goal: {profile.goal_weight} kg
          </p>
        </div>

        {/* Calorie Target Card (자동 계산됨) */}
        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>DAILY TARGET</p>
          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 'var(--space-sm)' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800 }}>{dailyTarget}</span>
            <span style={{ marginLeft: '8px', color: 'var(--text-muted)' }}>kcal</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', textAlign: 'center' }}>
          
          {/* Current Weight */}
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>CURRENT</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {currentWeight ? currentWeight : '--'} <span style={{ fontSize: '0.875rem', fontWeight: 400 }}>kg</span>
            </div>
          </div>

          {/* Change */}
          <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>CHANGE</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: Number(weightChange) > 0 ? 'red' : 'var(--primary)' }}>
              {Number(weightChange) > 0 ? '+' : ''}{weightChange} <span style={{ fontSize: '0.875rem', fontWeight: 400 }}>kg</span>
            </div>
          </div>

          {/* Remaining */}
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>TO GO</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {remaining} <span style={{ fontSize: '0.875rem', fontWeight: 400 }}>kg</span>
            </div>
          </div>

        </div>
      </div>

      <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center' }}>
        <Link href="/log">
          <button className="btn-primary">
            Log Today's Weight
          </button>
        </Link>
      </div>

    </div>
  );
}