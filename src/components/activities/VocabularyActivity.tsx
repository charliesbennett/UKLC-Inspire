'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, RotateCcw, Check } from 'lucide-react';

interface Flashcard {
  id: number;
  word: string;
  definition: string;
  example: string;
  image?: string;
}

const flashcards: Flashcard[] = [
  {
    id: 1,
    word: "atmosphere",
    definition: "The mood or feeling of a place",
    example: "The restaurant has a cozy atmosphere with dim lighting and soft music."
  },
  {
    id: 2,
    word: "themed",
    definition: "Designed around a particular subject or idea",
    example: "The themed restaurant was decorated like a medieval castle."
  },
  {
    id: 3,
    word: "unique",
    definition: "One of a kind; very special or unusual",
    example: "Dining in complete darkness is a unique experience."
  },
  {
    id: 4,
    word: "deliberately",
    definition: "On purpose; intentionally",
    example: "The staff were deliberately rude as part of the restaurant's concept."
  },
  {
    id: 5,
    word: "gourmet",
    definition: "High-quality food prepared by skilled chefs",
    example: "We enjoyed gourmet cuisine while suspended in the air."
  },
  {
    id: 6,
    word: "exaggerated",
    definition: "Made to seem larger, better, or worse than reality",
    example: "The waiters played exaggeratedly grumpy characters."
  },
  {
    id: 7,
    word: "appealing",
    definition: "Attractive or interesting",
    example: "The idea of eating in the sky is appealing to adventurous people."
  },
  {
    id: 8,
    word: "off-putting",
    definition: "Causing dislike or discouragement; unpleasant",
    example: "Some people find the toilet theme off-putting."
  },
  {
    id: 9,
    word: "suspended",
    definition: "Hanging from above; held in the air",
    example: "The dining table was suspended 50 meters above the ground."
  },
  {
    id: 10,
    word: "staged",
    definition: "Planned and performed for entertainment",
    example: "The restaurant has staged jump scares throughout the evening."
  },
  {
    id: 11,
    word: "sarcastic",
    definition: "Using irony to mock or show contempt",
    example: "The waiters delivered sarcastic comments with every order."
  },
  {
    id: 12,
    word: "rely on",
    definition: "To depend on or trust",
    example: "In complete darkness, you must rely on your other senses."
  }
];

export default function VocabularyActivity() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);

  const currentCard = flashcards[currentIndex];
  const progress = (knownCards.size / flashcards.length) * 100;

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMarkKnown = () => {
    setKnownCards(new Set(knownCards).add(currentCard.id));
    handleNext();
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Great Work!</h2>
              <p className="text-gray-600 mb-4">
                You've reviewed all {flashcards.length} vocabulary words
              </p>
              <p className="text-lg">
                You marked <span className="font-bold text-green-600">{knownCards.size}</span> out of{' '}
                <span className="font-bold">{flashcards.length}</span> as known
              </p>
            </div>
            <Button onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Review Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Restaurant Vocabulary</h2>
          <span className="text-sm text-gray-600">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-600 mt-1">
          {knownCards.size} words marked as known
        </p>
      </div>

      <div className="perspective-1000 mb-6">
        <Card
          className="cursor-pointer transition-transform duration-500 hover:shadow-lg min-h-[300px]"
          onClick={handleFlip}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <CardContent className="p-8 flex flex-col justify-center items-center min-h-[300px]">
            {!isFlipped ? (
              <div className="text-center">
                <h3 className="text-4xl font-bold mb-4 text-blue-600">
                  {currentCard.word}
                </h3>
                <p className="text-gray-500 text-sm">Click to see definition</p>
              </div>
            ) : (
              <div className="text-center" style={{ transform: 'rotateY(180deg)' }}>
                <p className="text-xl font-semibold mb-4 text-gray-800">
                  {currentCard.definition}
                </p>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 italic">
                    "{currentCard.example}"
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {isFlipped && (
          <Button
            onClick={handleMarkKnown}
            variant={knownCards.has(currentCard.id) ? "secondary" : "default"}
            className="gap-2"
          >
            <Check className="w-4 h-4" />
            {knownCards.has(currentCard.id) ? "Known" : "Mark as Known"}
          </Button>
        )}

        <Button
          onClick={handleNext}
          variant="outline"
          className="gap-2"
        >
          {currentIndex === flashcards.length - 1 ? 'Finish' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        Click the card to flip it
      </p>
    </div>
  );
}
