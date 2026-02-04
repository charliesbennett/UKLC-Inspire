import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { ArrowLeft, User, Award, Flame, Star, Calendar, Clock, CheckCircle } from 'lucide-react'

export default function ProfilePage({ user }) {
  const navigate = useNavigate()
  const [studentData, setStudentData] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfileData()
  }, [user])

  const loadProfileData = async () => {
    try {
      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .single()

      setStudentData(student)

      const { data: statsData } = await supabase
        .from('student_stats')
        .select('*')
        .eq('student_id', user.id)
        .single()

      setStats(statsData)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTrialDaysRemaining = () => {
    if (!studentData?.trial_end_date) return 0
    const endDate = new Date(studentData.trial_end_date)
    const today = new Date()
    const diffTime = endDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uklc-red"></div>
      </div>
    )
  }

  const badges = JSON.parse(stats?.badges || '[]')
  const trialDays = getTrialDaysRemaining()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-uklc-navy hover:text-uklc-red transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6 text-center">
          <div className="w-24 h-24 bg-uklc-red rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-uklc-navy mb-2">{studentData?.name}</h1>
          <p className="text-gray-600">
            Level {studentData?.level} (B1-B2) | Age {studentData?.age_group}
          </p>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-uklc-navy mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-uklc-red" />
            Statistics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-uklc-blue rounded-lg">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-uklc-navy">{stats?.total_xp || 0}</div>
              <p className="text-xs text-gray-600">Total XP</p>
            </div>

            <div className="text-center p-4 bg-uklc-blue rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-uklc-navy">{stats?.total_activities_completed || 0}</div>
              <p className="text-xs text-gray-600">Activities Done</p>
            </div>

            <div className="text-center p-4 bg-uklc-blue rounded-lg">
              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-uklc-navy">{stats?.current_streak || 0}</div>
              <p className="text-xs text-gray-600">Day Streak</p>
            </div>

            <div className="text-center p-4 bg-uklc-blue rounded-lg">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-uklc-navy">{stats?.total_time_minutes || 0}</div>
              <p className="text-xs text-gray-600">Minutes</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Longest Streak:</sp
