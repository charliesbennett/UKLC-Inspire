'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, ChevronRight, Lightbulb } from 'lucide-react';

interface GrammarExercise {
  id: number;
  type: 'fill-blank' | 'sentence-building' | 'correction' | 'opinion';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hint?: string;
}

const exercises: GrammarExercise[] = [
  {
    id: 1,
    type: 'fill-blank',
    question: "The restaurant has a very cozy __________, with warm lighting and soft music.",
    options: ['atmosphere', 'service', 'menu', 'kitchen'],
    correctAnswer: 'atmosphere',
    explanation: "'Atmosphere' refers to the mood or feeling of a place. We use it to describe the overall ambiance of a restaurant.",
    hint: "This word describes the overall feeling or mood of a place."
  },
  {
    id: 2,
    type: 'fill-blank',
    question: "I find the idea of eating in complete darkness quite __________.",
    options: ['appeal', 'appealing', 'appeals', 'appealed'],
    correctAnswer: 'appealing',
    explanation: "We use the adjective 'appealing' after 'find' + object + adjective. This structure expresses our opinion about something.",
    hint: "Use an adjective form to describe how you find something."
  },
  {
    id: 3,
    type: 'correction',
    question: "The staff was deliberately rude, what makes the restaurant unique.",
    correctAnswer: 'which makes the restaurant unique',
    explanation: "Use 'which' (not 'what') to introduce a relative clause that comments on the whole previous statement. 'Which' is the correct relative pronoun here.",
    hint: "Replace 'what' with a relative pronoun that refers to the previous clause."
  },
  {
    id: 4,
    type: 'fill-blank',
    question: "Some people might find the toilet theme __________, while others think it's hilarious.",
    options: ['off-putting', 'off-put', 'putting-off', 'put-off'],
    correctAnswer: 'off-putting',
    explanation: "'Off-putting' is a compound adjective meaning unpleasant or discouraging. Note the hyphen and the -ing form.",
    hint: "This compound adjective uses a hyphen and describes something unpleasant."
  },
  {
    id: 5,
    type: 'sentence-building',
    question: "Build a sentence using: would / I / to / like / try / restaurant / that / one day",
    correctAnswer: ['I would like to try that restaurant one day', 'I would like to try that restaurant one day.'],
    explanation: "The correct order is: Subject (I) + modal verb (would) + verb (like) + infinitive (to try) + object (that restaurant) + time phrase (one day).",
    hint: "Start with the subject 'I' and use 'would like to' to express a wish."
  },
  {
    id: 6,
    type: 'fill-blank',
    question: "The dining experience was __________ enhanced by the stunning view.",
    options: ['great', 'greatly', 'greater', 'greatness'],
    correctAnswer: 'greatly',
    explanation: "Use the adverb 'greatly' to modify the verb 'enhanced'. Adverbs describe how an action is performed.",
    hint: "You need an adverb (usually ending in -ly) to modify the verb 'enhanced'."
  },
  {
    id: 7,
    type: 'correction',
    question: "This is more unique than any other restaurant I've visited.",
    correctAnswer: ['more unique than any other restaurant I have visited', 'This is unique compared to any other restaurant I have visited', 'This is the most unique restaurant I have visited'],
    explanation: "'Unique' means one of a kind, so we don't usually use 'more' with it. Better options: 'This is unique' or 'This is the most unique' or 'This is more unusual than...'",
    hint: "'Unique' already means completely one of a kind. How can you rephrase without using 'more unique'?"
  },
  {
    id: 8,
    type: 'fill-blank',
    question: "__________ the rude service, I really enjoyed the food.",
    options: ['Despite', 'Although', 'However', 'Because'],
    correctAnswer: 'Despite',
    explanation: "'Despite' is a preposition followed by a noun phrase. It introduces a contrast. 'Although' would need a full clause (subject + verb).",
    hint: "Use a preposition that shows contrast, followed directly by 'the rude service'."
  },
  {
    id: 9,
    type: 'opinion',
    question: "Write a sentence explaining what makes a good restaurant for you. Use at least one adjective and one reason.",
    correctAnswer: ['example'],
    explanation: "A good answer includes: an adjective (cozy, modern, friendly), your preference, and a reason (because/as/since). Example: 'A good restaurant has a friendly atmosphere because it makes me feel welcome.'",
    hint: "Start with 'A good restaurant...' or 'For me, a good restaurant...'"
  },
  {
    id: 10,
    type: 'sentence-building',
    question: "Build a sentence using: too / some people / strange / find / concept / the",
    correctAnswer: ['Some people find the concept too strange', 'Some people find the concept too strange.'],
    explanation: "The structure is: Subject (Some people) + verb (find) + object (the concept) + adjective phrase (too strange). 'Too' means 'excessively' or 'more than acceptable'.",
    hint: "Use the pattern: 'find' + object + 'too' + adjective"
  }
];

export default function GrammarActivity() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<string[]>(new Array(exercises.length).fill(''));
  const [results, setResults] = useState<boolean[]>(new Array(exercises.length).fill(false));
  const [showResults, setShowResults] = useState(false);

  const exercise = exercises[currentExercise];
  const progress = ((currentExercise + 1) / exercises.length) * 100;

  const checkAnswer = (answer: string, correct: string | string[]): boolean => {
    const normalizedAnswer = answer.toLowerCase().trim().replace(/[.,!?;]$/g, '');
    
    if (Array.isArray(correct)) {
      return correct.some(c => 
        c.toLowerCase().trim().replace(/[.,!?;]$/g, '') === normalizedAnswer
      );
    }
    
    return correct.toLowerCase().trim().replace(/[.,!?;]$/g, '') === normalizedAnswer;
  };

  const handleSubmit = () => {
    if (userAnswer.trim()) {
      const newAnswers = [...answers];
      newAnswers[currentExercise] = userAnswer;
      setAnswers(newAnswers);

      const newResults = [...results];
      if (exercise.type === 'opinion') {
        // For opinion questions, check if they wrote something reasonable
        newResults[currentExercise] = userAnswer.trim().length > 10;
      } else {
        newResults[currentExercise] = checkAnswer(userAnswer, exercise.correctAnswer);
      }
      setResults(newResults);
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer(answers[currentExercise + 1]);
      setShowFeedback(false);
      setShowHint(false);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return results.filter(r => r).length;
  };

  if (showResults) {
    const score = calculateScore();
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
              <p className="text-xl text-gray-600 mb-4">
                You scored {score} out of {exercises.length}
              </p>
              <Progress value={percentage} className="h-3 mb-2" />
              <p className="text-lg font-semibold text-blue-600">{percentage}%</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Review Your Answers</h3>
              {exercises.map((ex, index) => {
                const isCorrect = results[index];
                const userAns = answers[index];

                return (
                  <Card key={ex.id} className={isCorrect ? 'border-green-500' : 'border-red-500'}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        )}
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
                    <span key={index} className="bg-white px-3 py-1 rounded border text-sm">
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {exercise.hint && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="mb-4 gap-2"
              >
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
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold mb-2">
                      {isCorrect ? 'Correct!' : exercise.type === 'opinion' ? 'Good try!' : 'Not quite right'}
                    </p>
                    {!isCorrect && exercise.type !== 'opinion' && (
                      <p className="text-sm mb-2">
                        Correct answer: <span className="font-semibold">
                          {Array.isArray(exercise.correctAnswer) 
                            ? exercise.correctAnswer[0] 
                            : exercise.correctAnswer}
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
            <Button
              onClick={handleSubmit}
              disabled={!userAnswer.trim() || showFeedback}
              variant="default"
            >
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
