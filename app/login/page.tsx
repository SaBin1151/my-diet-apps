'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // 로그인 로직
  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('Login Error: ' + error.message)
    } else {
      // 성공 시 /onboarding 페이지로 이동
      router.push('/onboarding')
    }
    setLoading(false)
  }

  // 회원가입 로직
  const handleSignUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert('Signup Error: ' + error.message)
    } else {
      alert('회원가입 성공! 이메일을 확인하여 인증 링크를 클릭해주세요.')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col gap-4 w-full max-w-xs border p-8 rounded">
        <h1 className="text-2xl font-bold text-center">Login / Sign Up</h1>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />

        <div className="flex flex-col gap-2 mt-4">
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Log In'}
          </button>
          
          <button 
            onClick={handleSignUp}
            disabled={loading}
            className="border border-gray-300 p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}