import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { ArrowLeft, Lock, Star } from 'lucide-react'

export default function TopicView({ user }) {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const [topic, setTopic] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTopicData()
  }, [topicId])

  const loadTopicData = async () => {
    try {
      // Load topic
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select('*')
        .eq('id', topicId)
        .single()

      if (topicError) throw topicError
      setTopic(topicData)

      // Load activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .eq('topic_id', topicId)
        .order('order_number')

      if (activitiesError) throw activitiesError
      setActivities(activitiesData || [])

    } catch (error) {
      console.error('Error loading topic:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    const icons = {
      'vocabulary': '📝',
      'grammar': '📖',
      'listening': '🎧',
      'speaking': '🗣️',
      'reading': '📚',
      'quiz': '✅'
    }
    return icons[type] || '📌'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uklc-red"></div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Topic not found</p>
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
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-uklc-navy hover:text-uklc-red transition mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-uklc-navy">{topic.title}</h1>
          <p className="text-gray-600">{topic.description}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-uklc-navy mb-4">Activities:</h2>
        
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-4xl">{getActivityIcon(activity.activity_type)}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-uklc-navy mb-1">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {activity.activity_type.charAt(0).toUpperCase() + activity.activity_type.slice(1)} • 
                    {activity.estimated_minutes ? ` ${activity.estimated_minutes} minutes` : ' 10 minutes'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">
                      +{activity.max_score || 100} XP
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <button
                  onClick={() => alert('Phase 2 Coming Soon!\n\nActivity players will be added next.')}
                  className="px-6 py-2 bg-uklc-red text-white rounded-lg font-medium hover:bg-opacity-90 transition"
                >
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No activities available yet.</p>
          </div>
        )}
      </main>
    </div>
  )
}
