'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface Restaurant {
  name: string;
  description: string;
  location: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const restaurants: Restaurant[] = [
  {
    name: "Karen's Diner",
    description: "A themed restaurant where deliberately rude service is part of the experience. Staff play exaggeratedly grumpy 'Karens,' insulting customers, enforcing silly rules, and delivering sarcastic banter alongside classic comfort food like burgers and fries. It's designed as interactive comedy dining, fun for those who enjoy playful insults and chaos, but not for anyone expecting traditional politeness.",
    location: "Various locations worldwide"
  },
  {
    name: "Dinner in the Sky",
    description: "Guests are strapped into seats around a table suspended 50 metres in the air by a crane. You eat gourmet food while dangling above cities like Dubai, London, and Las Vegas.",
    location: "Dubai, London, Las Vegas, and more"
  },
  {
    name: "The Lock Up",
    description: "A horror-prison restaurant in Tokyo, Japan where diners sit in jail cells, are 'arrested' by staff, and occasionally experience staged jump scares, flashing lights, and monsters.",
    location: "Tokyo, Japan"
  },
  {
    name: "Toilet Restaurant",
    description: "A restaurant in Taiwan where everything is toilet-themed: guests sit on toilet bowls, drinks come in mini urinals, and food is served in toilet-shaped dishes. Deeply weird—but hugely popular.",
    location: "Taiwan"
  },
  {
    name: "O. Noir",
    description: "A restaurant in Toronto, Canada where you eat in complete darkness, served by visually-impaired waitstaff. You can't see your food at all, forcing you to rely entirely on taste, smell, and touch.",
    location: "Toronto, Canada"
  }
];

const questions: Question[] = [
  {
    id: 1,
    question: "What makes Karen's Diner unique?",
    options: [
      "The staff are extremely polite and formal",
      "The staff deliberately act rude as part of the entertainment",
      "Customers must cook their own food",
      "It only serves vegetarian food"
    ],
    correctAnswer: 1,
    explanation: "Karen's Diner is unique because the staff play exaggeratedly grumpy characters who are deliberately rude to customers as part of the interactive comedy experience."
  },
  {
    id: 2,
    question: "How high is the dining table suspended at Dinner in the Sky?",
    options: [
      "10 metres",
      "25 metres",
      "50 metres",
      "100 metres"
    ],
    correctAnswer: 2,
    explanation: "The dining table at Dinner in the Sky is suspended 50 metres in the air by a crane."
  },
  {
    id: 3,
    question: "What is the main theme of The Lock Up restaurant?",
    options: [
      "Underwater ocean theme",
      "Medieval castle theme",
      "Horror-prison theme",
      "Space station theme"
    ],
    correctAnswer: 2,
    explanation: "The Lock Up is a horror-prison themed restaurant where diners experience jail cells, staged scares, and monster appearances."
  },
  {
    id: 4,
    question: "Which sense do you NOT use when dining at O. Noir?",
    options: [
      "Taste",
      "Sight",
      "Smell",
      "Touch"
    ],
    correctAnswer: 1,
    explanation: "At O. Noir, you eat in complete darkness, so you cannot use sight. You must rely on taste, smell, and touch instead."
  },
  {
    id: 5,
    question: "What would someone find off-putting about the Toilet Restaurant?",
    options: [
      "The high prices",
      "The small portions",
      "The toilet-themed décor and dishes",
      "The long waiting times"
    ],
    correctAnswer: 2,
    explanation: "Some people find the Toilet Restaurant off-putting because everything is toilet-themed, including sitting on toilet bowls and eating from toilet-shaped dishes."
  },
  {
    id: 6,
    question: "Who serves food at O. Noir?",
    options: [
      "Robot waiters",
      "Celebrity chefs",
      "Visually-impaired waitstaff",
      "The customers themselves"
    ],
    correctAnswer: 2,
    explanation: "O. Noir is served by visually-impaired waitstaff, who are skilled at navigating in complete darkness."
  },
  {
    id: 7,
    question: "What type of food is served at Karen's Diner?",
    options: [
      "Gourmet fine dining",
      "Classic comfort food",
      "Sushi and Japanese cuisine",
      "Only desserts"
    ],
    correctAnswer: 1,
    explanation: "Karen's Diner serves classic comfort food like burgers and fries alongside the comedic rude service experience."
  },
  {
    id: 8,
    question: "Which restaurant would be most appealing to thrill-seekers?",
    options: [
      "Karen's Diner - for comedy",
      "Dinner in the Sky - for height and adventure",
      "Toilet Restaurant - for weird themes",
      "O. Noir - for sensory experience"
    ],
    correctAnswer: 1,
    explanation: "Dinner in the Sky would be most appealing to thrill-seekers because of the extreme experience of dining 50 metres in the air."
  }
];

export default function ReadingActivity() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowFeedback(false);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return answers.filter((answer, index) => answer === questions[index].correctAnswer).length;
  };

  if (showResults) {
    const score = calculateScore();
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
              <p className="text-xl text-gray-600 mb-4">
                You scored {score} out of {questions.length}
              </p>
              <Progress value={percentage} className="h-3 mb-2" />
              <p className="text-lg font-semibold text-blue-600">{percentage}%</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Review Your Answers</h3>
              {questions.map((q, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === q.correctAnswer;

                return (
                  <Card key={q.id} className={isCorrect ? 'border-green-500' : 'border-red-500'}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold mb-2">{q.question}</p>
                          <p className="text-sm text-gray-600 mb-1">
                            Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {userAnswer !== null ? q.options[userAnswer] : 'Not answered'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-gray-600 mb-2">
                              Correct answer: <span className="text-green-600">
                                {q.options[q.correctAnswer]}
                              </span>
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
          <CardTitle>Crazy Restaurants Around the World</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {restaurants.map((restaurant, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="text-lg font-bold mb-1">{restaurant.name}</h3>
                <p className="text-sm text-gray-600 mb-2 italic">{restaurant.location}</p>
                <p className="text-gray-800">{restaurant.description}</p>
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
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            className="space-y-3"
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {showFeedback && (
            <Card className={`mt-6 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold mb-2">
                      {isCorrect ? 'Correct!' : 'Not quite right'}
                    </p>
                    <p className="text-sm">{currentQ.explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between mt-6">
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null || showFeedback}
              variant="default"
            >
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
