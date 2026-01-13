'use client'; // [중요] 이 줄이 있어야 onSubmit 같은 이벤트를 사용할 수 있습니다.

import React from 'react';
import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      
      {/* 1. Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ marginBottom: 'var(--space-sm)' }}>Let's set up your plan</h1>
        <p>We need a few details to calculate your calorie targets.</p>
      </div>

      {/* 2. Form Container */}
      <form onSubmit={(e) => e.preventDefault()}> {/* 이제 에러 없이 작동합니다 */}
        
        {/* Section A: Body Stats */}
        <div className="card">
          <h2 className="card-title">Body Stats</h2>
          
          <div className="grid-2">
            {/* Height */}
            <div>
              <label style={labelStyle}>HEIGHT (CM)</label>
              <input type="number" placeholder="175" style={inputStyle} />
            </div>
            
            {/* Age */}
            <div>
              <label style={labelStyle}>AGE</label>
              <input type="number" placeholder="25" style={inputStyle} />
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: 'var(--space-md)' }}>
            {/* Gender */}
            <div>
              <label style={labelStyle}>GENDER</label>
              <select style={inputStyle}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            {/* Current Weight */}
            <div>
              <label style={labelStyle}>CURRENT WEIGHT (KG)</label>
              <input type="number" placeholder="75.0" step="0.1" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Section B: Goals */}
        <div className="card">
          <h2 className="card-title">Goal</h2>
          
          <div>
            <label style={labelStyle}>GOAL WEIGHT (KG)</label>
            <input type="number" placeholder="68.0" step="0.1" style={inputStyle} />
          </div>
        </div>

        {/* Section C: Activity Level */}
        <div className="card">
          <h2 className="card-title">Activity</h2>
          
          <div className="grid-2">
            {/* Workout Days */}
            <div>
              <label style={labelStyle}>WORKOUT DAYS / WEEK</label>
              <select style={inputStyle}>
                <option>0 (Sedentary)</option>
                <option>1-2 days</option>
                <option>3-4 days</option>
                <option>5+ days</option>
              </select>
            </div>

            {/* Workout Minutes */}
            <div>
              <label style={labelStyle}>AVG. MINUTES / SESSION</label>
              <input type="number" placeholder="60" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* 3. Submit Action */}
        <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center' }}>
          <Link href="/dashboard">
            <button className="btn-primary" style={{ width: '100%', maxWidth: '300px' }}>
              Calculate Plan & Continue
            </button>
          </Link>
        </div>

      </form>
    </div>
  );
}

// -- Styles (Internal for clean JSX) --

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  color: 'var(--text-muted)',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.05em'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  fontSize: '1rem',
  border: '1px solid var(--border-subtle)',
  borderRadius: '6px',
  backgroundColor: '#fff',
  color: 'var(--text-main)',
  outline: 'none'
};