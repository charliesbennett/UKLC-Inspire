import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { GraduationCap, Flame, Star, Trophy, ArrowRight, User, LogOut } from 'lucide-react'

export default function Dashboard({ user }) {
  const navigate = useNavigate()
  const [studentData, setStudentData] = useState(null)
  const [stats, setStats] = useState({ total_xp: 0, current_streak: 0, badges: [] })
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      // Load student profile
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .single()

      if (studentError) throw studentError
      setStudentData(student)

      // Load student stats
      const { data: statsData, error: statsError } = await supabase
        .from('student_stats')
        .select('*')
        .eq('student_id', user.id)
        .single()

      if (statsError) {
        console.log('Stats error:', statsError)
      } else if (statsData) {
        // Safely parse badges
        let badgesArray = []
        try {
          if (statsData.badges) {
            if (typeof statsData.badges === 'string') {
              badgesArray = JSON.parse(statsData.badges)
            } else if (Array.isArray(statsData.badges)) {
              badgesArray = statsData.badges
            }
          }
        } catch (e) {
          console.error('Badge parse error:', e)
          badgesArray = []
        }

        setStats({
          total_xp: statsData.total_xp || 0,
          current_streak: statsData.current_streak || 0,
          badges: badgesArray
        })
      }

      // Load topics
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('level', student.level)
        .eq('age_group', student.age_group)
        .eq('is_published', true)
        .order('order_number')

      if (topicsError) throw topicsError
      setTopics(topicsData || [])

    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const getTopicIcon = (slug) => {
    const icons = {
      'food-restaurants': '🍽️',
      'music': '🎵',
      'travel': '✈️',
      'ai-technology': '🤖'
    }
    return icons[slug] || '📚'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uklc-red"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-uklc-red" />
            <span className="text-xl font-bold text-uklc-navy">UKLC Inspire</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <User className="w-5 h-5 text-uklc-navy" />
              <span className="text-sm text-uklc-navy hidden sm:inline">Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-uklc-red transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-uklc-navy mb-2">
            Welcome back, {studentData?.name?.split(' ')[0] || 'Student'}! 🌟
          </h1>
          <p className="text-gray-600">
            Level {studentData?.level || 2} (B1-B2) | Age {studentData?.age_group || '13-16'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-uklc-navy mb-4">YOUR PROGRESS</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-uklc-blue rounded-lg">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-uklc-navy mb-1">
                <Flame className="w-6 h-6 text-orange-500" />
                {stats.current_streak}
              </div>
              <p className="text-xs text-gray-600">Current Streak</p>
            </div>
            <div className="text-center p-4 bg-uklc-blue rounded-lg">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-uklc-navy mb-1">
                <Star className="w-6 h-6 text-yellow-500" />
                {stats.total_xp}
              </div>
              <p className="text-xs text-gray-600">Total XP</p>
            </div>
            <div className="text-center p-4 bg-uklc-blue rounded-lg">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-uklc-navy mb-1">
                <Trophy className="w-6 h-6 text-amber-600" />
                {stats.badges.length}
              </div>
              <p className="text-xs text-gray-600">Badges Earned</p>
            </div>
          </div>
        </div>

        {/* Your Topics */}
        <div>
          <h2 className="text-xl font-bold text-uklc-navy mb-4">Your Topics:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map(topic => (
              <div
                key={topic.id}
                onClick={() => navigate(`/topic/${topic.id}`)}
                className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition"
              >
                <div className="text-5xl mb-3">{getTopicIcon(topic.slug)}</div>
                <h3 className="text-xl font-bold text-uklc-navy mb-2">{topic.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{topic.description}</p>
                
                <button className="w-full bg-uklc-red text-white py-2 rounded-lg font-medium hover:bg-opacity-90 transition flex items-center justify-center gap-2">
                  Start Topic
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
