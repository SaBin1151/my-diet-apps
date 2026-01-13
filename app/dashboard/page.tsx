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
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. 사용자 체크
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // 2. DB에서 가장 최근 몸무게 1개 가져오기
      const { data, error } = await supabase
        .from('weight_logs')
        .select('weight')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) // 최신순 정렬
        .limit(1)
        .single();

      if (data) {
        setCurrentWeight(data.weight);
      }
      setLoading(false);
    };

    fetchData();
  }, [router]);

  // 화면 렌더링 (아직 데이터 로딩 중이면?)
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading data...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-lg)' }}>
        Today's Overview
      </h1>

      <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
        {/* Status Card (아직은 더미 데이터 유지) */}
        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>STATUS</p>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 'var(--space-sm)', color: 'var(--primary)' }}>
            STARTING
          </div>
          <p style={{ marginTop: 'var(--space-sm)', color: 'var(--text-main)' }}>
            Log your first weight!
          </p>
        </div>

        {/* Calorie Target Card (아직은 더미 데이터) */}
        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>DAILY TARGET</p>
          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 'var(--space-sm)' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800 }}>--</span>
            <span style={{ marginLeft: '8px', color: 'var(--text-muted)' }}>kcal</span>
          </div>
        </div>
      </div>

      {/* Weight Stats Card */}
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', textAlign: 'center' }}>
          
          {/* [REAL DATA] 실제 Supabase 데이터 표시 */}
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>CURRENT</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {currentWeight ? currentWeight : '--'} <span style={{ fontSize: '0.875rem', fontWeight: 400 }}>kg</span>
            </div>
          </div>

          {/* Change (나중에 구현) */}
          <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>CHANGE</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              -- <span style={{ fontSize: '0.875rem', fontWeight: 400 }}>kg</span>
            </div>
          </div>

          {/* Days Remaining (나중에 구현) */}
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>REMAINING</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              -- <span style={{ fontSize: '0.875rem', fontWeight: 400 }}>days</span>
            </div>
          </div>

        </div>
      </div>

      {/* Action Button */}
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