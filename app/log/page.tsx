'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LogWeight() {
  const router = useRouter()
  const supabase = createClient()
  const [weight, setWeight] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 1. 사용자 확인
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    // 2. 데이터 저장 (weight_logs)
    const { error } = await supabase.from('weight_logs').insert({
      user_id: user.id,
      weight: Number(weight),
      date: new Date().toISOString().split('T')[0] // 오늘 날짜 'YYYY-MM-DD'
    })

    if (error) {
      alert('Error saving weight: ' + error.message)
      setLoading(false)
    } else {
      // 3. 성공 시 대시보드로 이동 (자동으로 새 목표 계산됨)
      router.refresh() // 데이터 갱신을 위해 캐시 초기화
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full">
        
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-900">Log Weight</h1>
        <p className="text-gray-500 text-center mb-6">Enter today's measurement</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 75.5"
              required
              autoFocus
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Log'}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full py-3 text-gray-500 font-medium hover:text-gray-700"
          >
            Cancel
          </button>

        </form>
      </div>
    </div>
  )
}