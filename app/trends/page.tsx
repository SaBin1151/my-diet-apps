'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TrendsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }); // 최신순

      if (data) setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  // 이동평균(MA) 계산 함수
  const calculateMA = (index: number, days: number) => {
    // 데이터가 충분하지 않으면 계산 불가
    if (index + days > logs.length) return null;
    
    let sum = 0;
    for (let i = 0; i < days; i++) {
      sum += logs[index + i].weight;
    }
    return (sum / days).toFixed(1);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <Link href="/dashboard" style={{ marginRight: '16px', color: 'var(--text-muted)', textDecoration: 'none' }}>
          ← Back
        </Link>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Weight Trends</h1>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading data...</p>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)' }}>DATE</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-muted)' }}>WEIGHT</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-muted)' }}>7-DAY AVG</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => {
                const date = new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                const ma7 = calculateMA(index, 7);
                
                // 전날 대비 변화 (Delta)
                const prevLog = logs[index + 1];
                const delta = prevLog ? (log.weight - prevLog.weight).toFixed(1) : 0;
                const deltaColor = Number(delta) > 0 ? '#ef4444' : Number(delta) < 0 ? 'var(--primary)' : 'var(--text-muted)';

                return (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{date}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>
                      {log.weight}
                      <span style={{ fontSize: '0.75rem', color: deltaColor, marginLeft: '6px' }}>
                        {Number(delta) > 0 ? '+' : ''}{Number(delta) !== 0 ? delta : '-'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-muted)' }}>
                      {ma7 ? ma7 : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No data yet. Log your weight to see trends.
            </div>
          )}
        </div>
      )}
    </div>
  );
}