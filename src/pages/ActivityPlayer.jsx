import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { ArrowLeft } from 'lucide-react'
import QuizPlayer from '../components/QuizPlayer'

export default function ActivityPlayer({ user }) {
  const { activityId } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActivity()
  }, [activityId])

  const loadActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .single()

      if (error) throw error
      setActivity(data)
    } catch (error) {
      console.error('Error loading activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (results) => {
    try {
      // Save progress to database
      const { error } = await supabase
        .from('student_progress')
        .upsert({
          student_id: user.id,
          activity_id: activityId,
          completed: results.passed,
          score: results.score,
          time_spent_seconds: results.timeSpent,
          attempts: 1,
          completed_at: new Date().toISOString()
        })

      if (error) throw error

      // Award XP if passed
      if (results.passed) {
        const xpAmount = activity.activity_type === 'quiz' ? 150 : 100

        // Update student stats
        const { data: currentStats } = await supabase
          .from('student_stats')
          .select('total_xp, total_activities_completed')
          .eq('student_id', user.id)
          .single()

        await supabase
          .from('student_stats')
          .update({
            total_xp: (currentStats?.total_xp || 0) + xpAmount,
            total_activities_completed: (currentStats?.total_activities_completed || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('student_id', user.id)
      }
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uklc-red"></div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Activity not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-uklc-red hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-uklc-navy hover:text-uklc-red transition mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-uklc-navy">{activity.title}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activity.activity_type === 'quiz' && (
          <QuizPlayer activity={activity} onComplete={handleComplete} />
        )}
        
        {activity.activity_type !== 'quiz' && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-uklc-navy mb-4">
              Coming Soon!
            </h2>
            <p className="text-gray-600 mb-6">
              This activity type ({activity.activity_type}) will be available soon.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-uklc-red text-white rounded-lg font-medium hover:bg-opacity-90 transition"
            >
              Back to Topic
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
