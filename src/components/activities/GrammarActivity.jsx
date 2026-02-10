import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, ChevronRight, Lightbulb } from 'lucide-react';

/**
 * Data-driven Grammar Activity.
 *
 * Props:
 *   content.exercises — array of {
 *     type: 'fill-blank' | 'correction' | 'sentence-building' | 'opinion',
 *     question: string,
 *     options?: string[],           // for fill-blank (clickable chips)
 *     correctAnswer: string | string[],
 *     explanation: string,
 *     hint?: string
 *   }
 *   onComplete(score)
 *   onProgress(score)
 */
export default function GrammarActivity({ content, onComplete, onProgress }) {
  const exercises = content?.exercises || [];

  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState(new Array(exercises.length).fill(''));
  const [results, setResults] = useState(new Array(exercises.length).fill(false));
  const [showResults, setShowResults] = useState(false);

  const exercise = exercises[currentExercise];
  const progress = exercises.length > 0 ? ((currentExercise + 1) / exercises.length) * 100 : 0;

  const checkAnswer = (answer, correct) => {
    const normalized = answer.toLowerCase().trim().replace(/[.,!?;]$/g, '');
    if (Array.isArray(correct)) {
      return correct.some(c => c.toLowerCase().trim().replace(/[.,!?;]$/g, '') === normalized);
    }
    return correct.toLowerCase().trim().replace(/[.,!?;]$/g, '') === normalized;
  };

  const handleSubmit = () => {
    if (userAnswer.trim()) {
      const newAnswers = [...answers];
      newAnswers[currentExercise] = userAnswer;
      setAnswers(newAnswers);

      const newResults = [...results];
      if (exercise.type === 'opinion') {
        newResults[currentExercise] = userAnswer.trim().length > 10;
      } else {
        newResults[currentExercise] = checkAnswer(userAnswer, exercise.correctAnswer);
      }
      setResults(newResults);
      setShowFeedback(true);

      const correctSoFar = newResults.filter(r => r).length;
      const partialScore = Math.round((correctSoFar / exercises.length) * 100);
      onProgress?.(partialScore);
    }
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer(answers[currentExercise + 1]);
      setShowFeedback(false);
      setShowHint(false);
    } else {
      const finalScore = Math.round((results.filter(r => r).length / exercises.length) * 100);
      onComplete?.(finalScore);
      setShowResults(true);
    }
  };

  if (!exercises.length) {
    return <div className="text-center p-8 text-gray-500">No grammar exercises available.</div>;
  }

  if (showResults) {
    const score = results.filter(r => r).length;
    const percentage = Math.round((score / exercises.length) * 100);

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
              </div>
              <h2 className="text-3xl font-bold mb-2">Grammar Practice Complete!</h2>
              <p className="text-xl text-gray-600 mb-4">You scored {score} out of {exercises.length}</p>
              <Progress value={percentage} className="h-3 mb-2" />
              <p className="text-lg font-semibold text-blue-600">{percentage}%</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Review Your Answers</h3>
              {exercises.map((ex, index) => {
                const isCorrect = results[index];
                const userAns = answers[index];
                return (
                  <Card key={index} className={isCorrect ? 'border-green-500' : 'border-red-500'}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {isCorrect
                          ? <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          : <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />}
                        <div className="flex-1">
                          <p className="font-semibold mb-2">{ex.question}</p>
                          <p className="text-sm text-gray-600 mb-1">
                            Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {userAns || 'Not answered'}
                            </span>
                          </p>
                          {!isCorrect && ex.type !== 'opinion' && (
                            <p className="text-sm text-gray-600 mb-2">
                              Correct answer: <span className="text-green-600">
                                {Array.isArray(ex.correctAnswer) ? ex.correctAnswer[0] : ex.correctAnswer}
                              </span>
                            </p>
                          )}
                          <p className="text-sm text-gray-700 italic bg-blue-50 p-2 rounded mt-2">
                            💡 {ex.explanation}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCorrect = results[currentExercise];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Exercise {currentExercise + 1} of {exercises.length}</CardTitle>
            <Progress value={progress} className="w-32 h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm font-semibold text-blue-600 mb-2 uppercase">
              {exercise.type.replace('-', ' ')}
            </p>
            <p className="text-lg font-semibold mb-4">{exercise.question}</p>

            {exercise.options && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold mb-2">Choose from:</p>
                <div className="flex flex-wrap gap-2">
                  {exercise.options.map((option, index) => (
                    <span key={index} className="bg-white px-3 py-1 rounded border text-sm">{option}</span>
                  ))}
                </div>
              </div>
            )}

            {exercise.hint && (
              <Button variant="outline" size="sm" onClick={() => setShowHint(!showHint)} className="mb-4 gap-2">
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </Button>
            )}

            {showHint && exercise.hint && (
              <Card className="mb-4 bg-yellow-50 border-yellow-300">
                <CardContent className="p-3">
                  <p className="text-sm">💡 {exercise.hint}</p>
                </CardContent>
              </Card>
            )}

            {exercise.type === 'opinion' ? (
              <Textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Write your answer here..."
                className="mb-4"
                rows={4}
                disabled={showFeedback}
              />
            ) : (
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="mb-4"
                disabled={showFeedback}
              />
            )}
          </div>

          {showFeedback && (
            <Card className={`mb-6 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {isCorrect
                    ? <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    : <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />}
                  <div>
                    <p className="font-semibold mb-2">
                      {isCorrect ? 'Correct!' : exercise.type === 'opinion' ? 'Good try!' : 'Not quite right'}
                    </p>
                    {!isCorrect && exercise.type !== 'opinion' && (
                      <p className="text-sm mb-2">
                        Correct answer: <span className="font-semibold">
                          {Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer[0] : exercise.correctAnswer}
                        </span>
                      </p>
                    )}
                    <p className="text-sm">{exercise.explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button onClick={handleSubmit} disabled={!userAnswer.trim() || showFeedback} variant="default">
              Check Answer
            </Button>
            {showFeedback && (
              <Button onClick={handleNext} className="gap-2">
                {currentExercise === exercises.length - 1 ? 'See Results' : 'Next Exercise'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
