import React from 'react';

// TypeScript 인터페이스 정의: 이 컴포넌트가 받을 입력값(Props)의 타입
interface LayoutProps {
  children: React.ReactNode; // 레이아웃 안에 들어갈 내용물
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-wrapper">
      {/* 1. Header Section */}
      <header style={{ 
        borderBottom: '1px solid var(--border-subtle)', 
        paddingBottom: 'var(--space-md)',
        marginBottom: 'var(--space-xl)'
      }}>
        <div className="container" style={{ paddingBottom: 0, paddingTop: 'var(--space-md)' }}>
          <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>My Diet</span>
        </div>
      </header>

      {/* 2. Main Content Section */}
      <main className="container">
        {children}
      </main>
    </div>
  );
}