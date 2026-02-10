import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';

/**
 * Data-driven Reading Comprehension Activity.
 *
 * Props:
 *   content.title      — reading passage title (e.g. "Crazy Restaurants Around the World")
 *   content.passages    — array of { name, description, location }
 *   content.questions   — array of { question, options: string[], correctAnswer: number, explanation }
 *   onComplete(score)
 *   onProgress(score)
 */
export default function ReadingActivity({ content, onComplete, onProgress }) {
  const title = content?.title || 'Reading Comprehension';
  const passages = content?.passages || [];
  const questions = content?.questions || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState(new Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setShowFeedback(true);

      const correctSoFar = newAnswers.filter((a, i) => a === questions[i].correctAnswer).length;
      const partialScore = Math.round((correctSoFar / questions.length) * 100);
      onProgress?.(partialScore);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowFeedback(false);
    } else {
      const finalScore = Math.round(
        (answers.filter((a, i) => a === questions[i].correctAnswer).length / questions.length) * 100
      );
      onComplete?.(finalScore);
      setShowResults(true);
    }
  };

  if (!questions.length) {
    return <div className="text-center p-8 text-gray-500">No reading content available.</div>;
  }

  if (showResults) {
    const score = answers.filter((a, i) => a === questions[i].correctAnswer).length;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
              </div>
              <h2 className="text-3xl font-bold mb-2">Reading Complete!</h2>
              <p className="text-xl text-gray-600 mb-4">You scored {score} out of {questions.length}</p>
              <Progress value={percentage} className="h-3 mb-2" />
              <p className="text-lg font-semibold text-blue-600">{percentage}%</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Review Your Answers</h3>
              {questions.map((q, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === q.correctAnswer;
                return (
                  <Card key={index} className={isCorrect ? 'border-green-500' : 'border-red-500'}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {isCorrect
                          ? <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          : <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />}
                        <div className="flex-1">
                          <p className="font-semibold mb-2">{q.question}</p>
                          <p className="text-sm text-gray-600 mb-1">
                            Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {userAnswer !== null ? q.options[userAnswer] : 'Not answered'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-gray-600 mb-2">
                              Correct answer: <span className="text-green-600">{q.options[q.correctAnswer]}</span>
                            </p>
                          )}
                          <p className="text-sm text-gray-700 italic">{q.explanation}</p>
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

  const currentQ = questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Reading Passage */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {passages.map((passage, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="text-lg font-bold mb-1">{passage.name}</h3>
                {passage.location && (
                  <p className="text-sm text-gray-600 mb-2 italic">{passage.location}</p>
                )}
                <p className="text-gray-800">{passage.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
            <Progress value={progress} className="w-32 h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold mb-6">{currentQ.question}</p>

          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            className="space-y-3"
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>

          {showFeedback && (
            <Card className={`mt-6 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {isCorrect
                    ? <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    : <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />}
                  <div>
                    <p className="font-semibold mb-2">{isCorrect ? 'Correct!' : 'Not quite right'}</p>
                    <p className="text-sm">{currentQ.explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between mt-6">
            <Button onClick={handleSubmit} disabled={selectedAnswer === null || showFeedback} variant="default">
              Submit Answer
            </Button>
            {showFeedback && (
              <Button onClick={handleNext} className="gap-2">
                {currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
