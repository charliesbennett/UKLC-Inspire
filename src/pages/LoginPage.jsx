import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { GraduationCap, Mail, Lock, User, Key } from 'lucide-react'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    courseCode: '',
    ageGroup: '13-16',
    level: 2
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error
      // Successful login - App.jsx will handle redirect
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // First, sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      // Then create their student record
      const { error: studentError } = await supabase
        .from('students')
        .insert([{
          id: authData.user.id,
          email: formData.email,
          name: formData.name,
          age_group: formData.ageGroup,
          level: formData.level,
          course_code: formData.courseCode,
        }])

      if (studentError) throw studentError

      // Initialize their stats
      const { error: statsError } = await supabase
        .from('student_stats')
        .insert([{
          student_id: authData.user.id,
        }])

      if (statsError) throw statsError

      // Success! User will be logged in automatically
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uklc-blue to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-uklc-red rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-uklc-navy mb-2">UKLC Inspire</h1>
          <p className="text-gray-600">Continue Your English Journey</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Toggle Login/Register */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                isLogin
                  ? 'bg-uklc-red text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                !isLogin
                  ? 'bg-uklc-red text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <>
                {/* Course Code */}
                <div>
                  <label className="block text-sm font-medium text-uklc-navy mb-1">
                    Course Code *
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.courseCode}
                      onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                      placeholder="e.g., UKLC2024SUMMER"
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-uklc-red focus:outline-none"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the code you received at the end of your UKLC course
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-uklc-navy mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-uklc-red focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-uklc-navy mb-1">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-uklc-red focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-uklc-navy mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  minLength="6"
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-uklc-red focus:outline-none"
                />
              </div>
              {!isLogin && (
                <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-uklc-red text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          {!isLogin && (
            <div className="mt-6 p-4 bg-uklc-blue rounded-lg">
              <p className="text-sm text-uklc-navy">
                <strong>🎉 Free Trial:</strong> Get 30 days of unlimited access when you sign up!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Need help? Email{' '}
          <a href="mailto:charlie@uklc.com" className="text-uklc-red hover:underline">
            support@uklc.com
          </a>
        </p>
      </div>
    </div>
  )
}
