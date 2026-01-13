// Input 데이터 타입 정의
interface CalculatorInputs {
  gender: string // 'male' or 'female'
  age: number
  height: number // cm
  weight: number // kg
  workoutDays: number // 주당 운동 횟수
  workoutMinutes: number // 1회당 평균 운동 시간
}

// Output 데이터 타입 정의
interface CalculatorOutputs {
  bmr: number
  tdee: number
  dailyTarget: number
}

export function calculateCalories(input: CalculatorInputs): CalculatorOutputs {
  const { gender, age, height, weight, workoutDays, workoutMinutes } = input

  // 1. BMR 계산 (Mifflin-St Jeor 공식)
  // 가장 널리 쓰이는 정확한 기초대사량 공식입니다.
  // 남성: (10 × kg) + (6.25 × cm) - (5 × age) + 5
  // 여성: (10 × kg) + (6.25 × cm) - (5 × age) - 161
  let bmr = (10 * weight) + (6.25 * height) - (5 * age)
  if (gender === 'male') {
    bmr += 5
  } else {
    bmr -= 161
  }

  // 2. NEAT (Non-Exercise Activity Thermogenesis)
  // 운동 외 활동(걷기, 요리, 청소 등)으로 쓰는 칼로리입니다.
  // 여기서는 BMR의 10%로 단순화하여 계산합니다.
  const neat = bmr * 0.1

  // 3. 운동 칼로리 (Exercise Calories)
  // 6 METs(중강도 운동: 웨이트 트레이닝, 조깅 등)를 가정합니다.
  // 공식: (METs * 3.5 * 몸무게) / 200 = 분당 소모 칼로리
  const met = 6
  const caloriesPerMinute = (met * 3.5 * weight) / 200
  
  // 주당 총 운동 칼로리 계산
  const weeklyExerciseCalories = caloriesPerMinute * workoutMinutes * workoutDays
  
  // 이를 하루 평균으로 나눔 (TDEE에 더하기 위해)
  const dailyExerciseCalories = weeklyExerciseCalories / 7

  // 4. TDEE (Total Daily Energy Expenditure)
  // 하루 총 에너지 소비량 = 기초대사량 + 생활 활동량 + 운동량
  const tdee = bmr + neat + dailyExerciseCalories

  // 5. 다이어트 목표 칼로리 (Daily Target)
  // 목표: 주당 0.5kg 체지방 감량
  // 지방 1kg = 약 7700kcal
  // 0.5kg 감량 = 주당 3850kcal 부족하게 먹어야 함
  // 하루 부족량 = 3850 / 7 = 550kcal
  const dailyTarget = tdee - 550

  // 소수점 반올림하여 깔끔한 정수로 반환
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyTarget: Math.round(dailyTarget),
  }
}