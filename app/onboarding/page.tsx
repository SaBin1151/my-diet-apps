'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const currentWeight = Number(formData.get('current_weight'))

    // 1. 현재 로그인한 유저 확인
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    // 2. Profile 테이블에 기본 정보 저장
    const { error: profileError } = await supabase.from('profiles').upsert({
      user_id: user.id,
      height: Number(formData.get('height')),
      age: Number(formData.get('age')),
      gender: String(formData.get('gender')),
      start_weight: currentWeight,
      goal_weight: Number(formData.get('goal_weight')),
      workout_days_per_week: Number(formData.get('workout_days')),
      average_workout_minutes: Number(formData.get('workout_minutes'))
    })

    if (profileError) {
      alert('프로필 저장 실패: ' + profileError.message)
      setLoading(false)
      return
    }

    // 3. Weight Logs 테이블에 '시작 체중'을 첫 기록으로 저장
    const { error: logError } = await supabase.from('weight_logs').insert({
      user_id: user.id,
      weight: currentWeight,
      date: new Date().toISOString().split('T')[0] // 오늘 날짜 (YYYY-MM-DD)
    })

    if (logError) {
      console.error('체중 기록 실패:', logError)
      // 프로필은 성공했으므로 치명적 에러로 처리하지 않고 넘어갑니다.
    }

    // 4. 완료 후 대시보드로 이동
    alert('설정이 완료되었습니다!')
    router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Let's set up your profile</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* 기본 신체 정보 */}
        <div className="flex gap-4">
          <label className="flex-1">
            <span className="block text-sm font-bold mb-1">Height (cm)</span>
            <input name="height" type="number" required className="w-full border p-2 rounded" />
          </label>
          <label className="flex-1">
            <span className="block text-sm font-bold mb-1">Age</span>
            <input name="age" type="number" required className="w-full border p-2 rounded" />
          </label>
        </div>

        <label>
          <span className="block text-sm font-bold mb-1">Gender</span>
          <select name="gender" className="w-full border p-2 rounded">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        {/* 체중 정보 */}
        <div className="flex gap-4">
          <label className="flex-1">
            <span className="block text-sm font-bold mb-1">Current Weight (kg)</span>
            <input name="current_weight" type="number" step="0.1" required className="w-full border p-2 rounded" />
          </label>
          <label className="flex-1">
            <span className="block text-sm font-bold mb-1">Goal Weight (kg)</span>
            <input name="goal_weight" type="number" step="0.1" required className="w-full border p-2 rounded" />
          </label>
        </div>

        <hr className="my-2" />

        {/* 운동 습관 */}
        <label>
          <span className="block text-sm font-bold mb-1">Workout Days (per week)</span>
          <input name="workout_days" type="number" min="0" max="7" required className="w-full border p-2 rounded" />
        </label>

        <label>
          <span className="block text-sm font-bold mb-1">Avg. Workout Minutes</span>
          <input name="workout_minutes" type="number" min="0" required className="w-full border p-2 rounded" />
        </label>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-green-600 text-white py-3 rounded mt-4 font-bold hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Complete Setup'}
        </button>

      </form>
    </div>
  )
}