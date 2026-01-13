'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { calculateCalories } from '@/utils/calorieCalculator' // 방금 만든 계산기 import

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()
  
  // 상태 관리
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [latestLog, setLatestLog] = useState<any>(null)
  const [stats, setStats] = useState({
    targetCalories: 0,
    weightChange: 0,
    daysRemaining: 0,
    paceStatus: 'Calculating...'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // 1. 유저 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // 2. 프로필 가져오기
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!profileData) {
      router.push('/onboarding') // 프로필 없으면 설정 페이지로
      return
    }

    // 3. 가장 최근 체중 기록 가져오기 (날짜 내림차순 정렬 후 1개만)
    const { data: logData } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(1)
      .single()

    // 데이터 세팅
    setProfile(profileData)
    setLatestLog(logData) // logData가 없을 수도 있음 (방어 로직 필요)
    
    // 4. 계산 로직 실행
    calculateStats(profileData, logData)
    setLoading(false)
  }

  const calculateStats = (profile: any, log: any) => {
    if (!profile || !log) return

    const currentWeight = log.weight
    const startWeight = profile.start_weight
    const goalWeight = profile.goal_weight

    // 1. 변화량 (Change)
    const change = currentWeight - startWeight

    // 2. 일일 칼로리 타겟 재계산 (Recalculate Target)
    // 현재 체중을 기준으로 계산해야 가장 정확합니다.
    const calcResult = calculateCalories({
      gender: profile.gender,
      age: profile.age,
      height: profile.height,
      weight: currentWeight, // 현재 체중 대입
      workoutDays: profile.workout_days_per_week,
      workoutMinutes: profile.average_workout_minutes
    })

    // 3. 목표까지 남은 기간 (Remaining Days)
    // 주당 0.5kg 감량 가정 (하루 약 0.071kg)
    const remainingWeight = currentWeight - goalWeight
    const daysLeft = remainingWeight > 0 ? Math.round(remainingWeight / (0.5 / 7)) : 0

    // 4. 페이스 상태 (Pace Status)
    // 가입일로부터 며칠 지났는지 계산
    const startDate = new Date(profile.created_at)
    const today = new Date()
    const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1 // 최소 1일
    
    // 예상 감량치 (Days * 0.071kg)
    const expectedLoss = daysPassed * (0.5 / 7)
    const actualLoss = startWeight - currentWeight

    let status = 'On Track'
    if (actualLoss > expectedLoss + 0.5) status = 'Fast 🔥' // 예상보다 0.5kg 더 빠짐
    else if (actualLoss < expectedLoss - 0.5) status = 'Slow 🐢' // 예상보다 0.5kg 덜 빠짐

    setStats({
      targetCalories: calcResult.dailyTarget,
      weightChange: Number(change.toFixed(1)),
      daysRemaining: daysLeft,
      paceStatus: status
    })
  }

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back!</p>
          </div>
          <button 
            onClick={() => router.push('/log')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition"
          >
            Log Today's Weight
          </button>
        </header>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Card 1: Today's Target */}
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-blue-50">
            <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider">Daily Target</h3>
            <p className="text-4xl font-bold text-blue-900 mt-2">{stats.targetCalories}</p>
            <p className="text-sm text-blue-700 mt-1">kcal / day</p>
          </div>

          {/* Card 2: Current Weight */}
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Current Weight</h3>
            <p className="text-4xl font-bold text-gray-900 mt-2">{latestLog?.weight} <span className="text-lg font-normal">kg</span></p>
            <p className={`text-sm mt-1 font-medium ${stats.weightChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {stats.weightChange > 0 ? '+' : ''}{stats.weightChange} kg total
            </p>
          </div>

          {/* Card 3: Pace Status */}
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pace Status</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.paceStatus}</p>
            <p className="text-sm text-gray-400 mt-1">vs. 0.5kg/week plan</p>
          </div>

           {/* Card 4: Estimated Time */}
           <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Goal In</h3>
            <p className="text-4xl font-bold text-gray-900 mt-2">{stats.daysRemaining}</p>
            <p className="text-sm text-gray-400 mt-1">days remaining</p>
          </div>

        </div>

      </div>
    </div>
  )
}