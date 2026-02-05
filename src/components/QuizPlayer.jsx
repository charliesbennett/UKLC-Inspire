import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Star } from 'lucide-react'

export default function QuizPlayer({ activity, onComplete }) {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [startTime] = useState(Date.now())

  const quizContent = typeof activity.content === 'string' 
    ? JSON.parse(activity.content) 
    : activity.content

  const questions = quizContent.sections?.flatMap(section => 
    section.questions.map(q => ({ ...q, section: section.title }))
  ) || []

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    })
  }

  const calculateResults = () => {
    let correct = 0
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })

    const score = Math.round((correct / questions.length) * 100)
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    const passed = score >= (quizContent.passPercentage || 70)

    return {
      correct,
      total: questions.length,
      score,
      timeSpent,
      passed
    }
  }

  const handleFinish = () => {
    const results = calculateResults()
    setShowResults(true)
    onComplete(results)
  }

  const getStarRating = (score) => {
    if (score >= 90) return 5
    if (score >= 80) return 4
    if (score >= 70) return 3
    if (score >= 60) return 2
    return 1
  }

  if (showResults) {
    const results = calculateResults()
    const stars = getStarRating(results.score)

    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{results.passed ? '🎉' : '📚'}</div>
          <h2 className="text-3xl font-bold text-uklc-navy mb-2">
            {results.passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h2>
          <p className="text-gray-600">
            {results.passed 
              ? 'You passed the quiz!' 
              : `You need ${quizContent.passPercentage || 70}% to pass. Try again!`}
          </p>
        </div>

        {/* Score */}
        <div className="bg-uklc-blue rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-uklc-navy mb-2">
              {results.score}%
            </div>
            <p className="text-gray-600">
              {results.correct} out of {results.total} correct
            </p>
            <div className="flex justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* XP Earned */}
        {results.passed && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-green-800 font-medium">
              🌟 You earned 150 XP!
            </p>
          </div>
        )}

        {/* Section Breakdown */}
        <div className="mb-6">
          <h3 className="font-bold text-uklc-navy mb-3">Section Breakdown:</h3>
          {quizContent.sections?.map(section => {
            const sectionQuestions = questions.filter(q => q.section === section.title)
            const sectionCorrect = sectionQuestions.filter((q, idx) => {
              const globalIdx = questions.indexOf(q)
              return selectedAnswers[globalIdx] === q.correctAnswer
            }).length
            const sectionScore = Math.round((sectionCorrect / sectionQuestions.length) * 100)

            return (
              <div key={section.title} className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">{section.title}</span>
                <span className="font-medium text-uklc-navy">
                  {sectionCorrect}/{sectionQuestions.length} ({sectionScore}%)
                </span>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Back to Dashboard
          </button>
          {!results.passed && (
            <button
              onClick={() => {
                setCurrentQuestion(0)
                setSelectedAnswers({})
                setShowResults(false)
              }}
              className="flex-1 px-6 py-3 bg-uklc-red text-white rounded-lg font-medium hover:bg-opacity-90 transition"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const isAnswered = selectedAnswers[currentQuestion] !== undefined
  const allAnswered = questions.every((_, idx) => selectedAnswers[idx] !== undefined)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span className="font-medium">
            {Object.keys(selectedAnswers).length} / {questions.length}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-uklc-red transition-all duration-300"
            style={{
              width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            {question.section && (
              <div className="text-xs text-uklc-red font-medium mt-1">
                {question.section}
              </div>
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold text-uklc-navy mb-6">
          {question.question}
        </h2>

        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion] === index
            const isCorrect = question.correctAnswer === index
            const showFeedback = isAnswered

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  showFeedback && isCorrect
                    ? 'border-green-500 bg-green-50'
                    : showFeedback && isSelected && !isCorrect
                    ? 'border-red-500 bg-red-50'
                    : isSelected
                    ? 'border-uklc-red bg-uklc-pink'
                    : 'border-gray-200 hover:border-uklc-red hover:bg-gray-50'
                } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1">{option}</span>
                  {showFeedback && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                  )}
                  {showFeedback && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {isAnswered && question.explanation && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-900">
              <strong>Explanation:</strong> {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-uklc-red transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            className="flex items-center gap-2 px-6 py-2 bg-uklc-red text-white rounded-lg font-medium hover:bg-opacity-90 transition"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={!allAnswered}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Finish Quiz
          </button>
        )}
      </div>

      {/* Question Grid */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-4">
        <p className="text-sm text-gray-600 mb-3">Jump to question:</p>
        <div className="grid grid-cols-10 gap-2">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestion(idx)}
              className={`aspect-square rounded-lg text-sm font-medium transition ${
                idx === currentQuestion
                  ? 'bg-uklc-red text-white'
                  : selectedAnswers[idx] !== undefined
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
