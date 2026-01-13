import React from 'react';
import Link from 'next/link'; // 페이지 이동을 위한 Next.js 링크 컴포넌트

export default function LogPage() {
  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', textAlign: 'center' }}>
      
      {/* 1. Title */}
      <h1 style={{ marginBottom: 'var(--space-xl)', fontSize: '1.5rem' }}>
        Log Weight
      </h1>

      {/* 2. Input Field */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <label 
          style={{ 
            display: 'block', 
            marginBottom: 'var(--space-sm)', 
            color: 'var(--text-muted)', 
            fontSize: '0.875rem', 
            fontWeight: 600 
          }}
        >
          TODAY'S WEIGHT (KG)
        </label>
        
        <input 
          type="number" 
          placeholder="0.0" 
          step="0.1"
          autoFocus
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '2rem',
            fontWeight: '700',
            textAlign: 'center',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            outline: 'none',
            color: 'var(--text-main)',
            backgroundColor: 'var(--bg-card)'
          }}
        />
      </div>

      {/* 3. Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {/* Primary Action */}
        <button className="btn-primary" style={{ width: '100%', padding: '16px' }}>
          Save Entry
        </button>

        {/* Secondary Action (Cancel) */}
        <Link 
          href="/dashboard" 
          style={{ 
            color: 'var(--text-muted)', 
            textDecoration: 'none', 
            fontSize: '0.875rem',
            padding: '8px'
          }}
        >
          Cancel
        </Link>
      </div>

    </div>
  );
}