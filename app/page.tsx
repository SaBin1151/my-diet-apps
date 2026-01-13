import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '60px' }}>
      
      {/* 1. Hero Section */}
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 'var(--space-md)' }}>
        My Diet Planner
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
        Simple, analytical weight management.
      </p>

      {/* 2. Menu Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
        
        {/* Onboarding Button */}
        <Link href="/onboarding">
          <button className="btn-primary" style={{ padding: '16px 32px' }}>
            Get Started
          </button>
        </Link>

        {/* Dashboard Button (이미 사용 중이라면) */}
        <Link href="/dashboard">
          <button 
            style={{ 
              padding: '16px 32px', 
              background: 'transparent', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Go to Dashboard
          </button>
        </Link>
      </div>

    </div>
  );
}