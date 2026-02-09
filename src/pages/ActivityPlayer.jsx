import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { ArrowLeft } from 'lucide-react'
import { useProgressTracker } from '../hooks/useProgressTracker'
import CompletionModal from '../components/activities/CompletionModal'
import QuizPlayer from '../components/QuizPlayer'
import VocabularyActivity from '../components/activities/VocabularyActivity'
import ReadingActivity from '../components/activities/ReadingActivity'
import GrammarActivity from '../components/activities/GrammarActivity'
import RestaurantDesignActivity from '../components/activities/RestaurantDesignActivity'

export default function ActivityPlayer({ user }) {
  const { activityId } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)

  // Progress tracking
  const {
    saving,
    error: progressError,
    startActivity,
    resetAttempts,
    updateProgress,
    completeActivity,
    getProgress,
  } = useProgressTracker(user?.id)

  const [completionData, setCompletionData] = useState(null)
  const [showCompletion, setShowCompletion] = useState(false)

  useEffect(() => {
    loadActivity()
  }, [activityId])

  // Start tracking when activity loads
  useEffect(() => {
    if (activity && user?.id) {
      resetAttempts()
      startActivity(activityId)
    }
  }, [activity, user?.id, activityId, startActivity, resetAttempts])

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

  // ── New unified completion handler for all activity types ──
  const handleActivityComplete = async (score) => {
    if (!activity) return

    const result = await completeActivity(activityId, activity.activity_type, score)
    if (result) {
      setCompletionData(result)
      setShowCompletion(true)
    }
  }

  // ── Keep existing QuizPlayer handler (it passes a results object) ──
  const handleQuizComplete = async (results) => {
    const score = results.score
    await handleActivityComplete(score)
  }

  // ── Mid-activity partial save (optional) ──
  const handlePartialProgress = async (currentScore) => {
    await updateProgress(activityId, currentScore)
  }

  const handleRetry = () => {
    setShowCompletion(false)
    setCompletionData(null)
    startActivity(activityId)
  }

  const handleContinue = () => {
    setShowCompletion(false)
    navigate('/dashboard')
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
          <QuizPlayer activity={activity} onComplete={handleQuizComplete} />
        )}

        {activity.activity_type === 'vocabulary' && (
          <VocabularyActivity
            onComplete={handleActivityComplete}
            onProgress={handlePartialProgress}
          />
        )}

        {activity.activity_type === 'reading' && (
          <ReadingActivity
            onComplete={handleActivityComplete}
            onProgress={handlePartialProgress}
          />
        )}

        {activity.activity_type === 'grammar' && activity.id === 6 && (
          <GrammarActivity
            onComplete={handleActivityComplete}
            onProgress={handlePartialProgress}
          />
        )}

        {activity.activity_type === 'grammar' && activity.id === 10 && (
          <RestaurantDesignActivity
            onComplete={handleActivityComplete}
            onProgress={handlePartialProgress}
          />
        )}

        {activity.activity_type !== 'quiz' &&
         activity.activity_type !== 'vocabulary' &&
         activity.activity_type !== 'reading' &&
         activity.activity_type !== 'grammar' &&
         activity.activity_type !== 'project' && (
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

      {/* Saving indicator */}
      {saving && (
        <div className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
          Saving progress...
        </div>
      )}

      {/* Error indicator */}
      {progressError && (
        <div className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          Save error: {progressError}
        </div>
      )}

      {/* Completion modal */}
      {showCompletion && completionData && (
        <CompletionModal
          score={completionData.progress.score}
          xpEarned={completionData.xpEarned}
          newBadges={completionData.newBadges}
          onRetry={handleRetry}
          onContinue={handleContinue}
        />
      )}
    </div>
  )
}
