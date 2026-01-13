import React from 'react';
import Link from 'next/link'; // [수정됨] 페이지 이동을 위한 Link 컴포넌트 추가

// [MOCK DATA] 나중에 백엔드에서 가져올 가짜 데이터입니다.
const DATA = {
  date: "Tue, Jan 14",
  status: "ON TRACK",
  calories: 2150,
  message: "Consistent pace. Keep it up.",
  weight: {
    current: 78.5,
    change: -1.2, // 시작 대비 변화량
    daysRemaining: 45
  }
};

export default function DashboardPage() {
  return (
    <div>
      {/* 1. Page Header: 날짜 표시 */}
      <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-lg)' }}>
        {DATA.date}
      </h1>

      {/* 2. Main Grid: 상태와 목표 칼로리 */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
        
        {/* Card: Status */}
        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            STATUS
          </p>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 'var(--space-sm)', color: 'var(--primary)' }}>
            {DATA.status}
          </div>
          <p style={{ marginTop: 'var(--space-sm)', color: 'var(--text-main)' }}>
            {DATA.message}
          </p>
        </div>

        {/* Card: Calorie Target */}
        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            DAILY TARGET
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 'var(--space-sm)' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800 }}>
              {DATA.calories}
            </span>
            <span style={{ marginLeft: '8px', color: 'var(--text-muted)' }}>kcal</span>
          </div>
        </div>
      </div>

      {/* 3. Secondary Stats: 체중 및 진행 상황 */}
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', textAlign: 'center' }}>
          
          {/* Current Weight */}
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>CURRENT</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {DATA.weight.current} <span style={{ fontSize: '0.875rem', fontWeight: 400 }}>kg</span>
            </div>
          </div>

          {/* Change */}
          <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>CHANGE</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: DATA.weight.change < 0 ? 'var(--primary)' : 'var(--text-main)' }}>
              {DATA.weight.change} <span style={{ fontSize: '0.875rem', fontWeight: 400 }}>kg</span>
            </div>
          </div>

          {/* Days Remaining */}
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>REMAINING</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {DATA.weight.daysRemaining} <span style={{ fontSize: '0.875rem', fontWeight: 400 }}>days</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Action Button */}
      <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center' }}>
        {/* [수정됨] Link 컴포넌트로 버튼 감싸기 */}
        <Link href="/log">
          <button className="btn-primary">
            Log Today's Weight
          </button>
        </Link>
      </div>

    </div>
  );
}