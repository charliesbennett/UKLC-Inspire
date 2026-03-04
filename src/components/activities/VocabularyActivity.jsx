import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, RotateCcw, Check } from 'lucide-react';

/**
 * Data-driven Vocabulary Flashcard Activity.
 *
 * Props:
 *   content.flashcards — array of { word, definition, example }
 *   onComplete(score)  — called when finished
 *   onProgress(score)  — called after each "mark as known"
 */
export default function VocabularyActivity({ content, onComplete, onProgress }) {
  const flashcards = content?.flashcards || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState(new Set());
  const [showResults, setShowResults] = useState(false);

  const currentCard = flashcards[currentIndex];
  const progress = flashcards.length > 0 ? (knownCards.size / flashcards.length) * 100 : 0;

  const finishActivity = (finalKnownCards) => {
    const finalScore = Math.round((finalKnownCards.size / flashcards.length) * 100);
    onComplete?.(finalScore);
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Use current knownCards state (not stale when called from handleMarkKnown)
      finishActivity(knownCards);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleMarkKnown = () => {
    const newKnownCards = new Set(knownCards);
    newKnownCards.add(currentCard.word);
    setKnownCards(newKnownCards);

    const partialScore = Math.round((newKnownCards.size / flashcards.length) * 100);
    onProgress?.(partialScore);

    // If this is the last card, finish with the updated set directly
    if (currentIndex >= flashcards.length - 1) {
      finishActivity(newKnownCards);
    } else {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setShowResults(false);
  };

  if (!flashcards.length) {
    return <div className="text-center p-8 text-gray-500">No vocabulary content available.</div>;
  }

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
              <RotateCcw className="w-4 h-4" /> Review Again
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
          <h2 className="text-xl font-bold">Vocabulary</h2>
          <span className="text-sm text-gray-600">Card {currentIndex + 1} of {flashcards.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-600 mt-1">{knownCards.size} words marked as known</p>
      </div>

      <div className="perspective-1000 mb-6">
        <Card
          className="cursor-pointer transition-transform duration-500 hover:shadow-lg min-h-[300px]"
          onClick={handleFlip}
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <CardContent className="p-8 flex flex-col justify-center items-center min-h-[300px]">
            {!isFlipped ? (
              <div className="text-center">
                <h3 className="text-4xl font-bold mb-4 text-blue-600">{currentCard.word}</h3>
                <p className="text-gray-500 text-sm">Click to see definition</p>
              </div>
            ) : (
              <div className="text-center" style={{ transform: 'rotateY(180deg)' }}>
                <p className="text-xl font-semibold mb-4 text-gray-800">{currentCard.definition}</p>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 italic">"{currentCard.example}"</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 justify-between">
        <Button onClick={handlePrevious} disabled={currentIndex === 0} variant="outline" className="gap-2">
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>
        {isFlipped && (
          <Button onClick={handleMarkKnown} variant={knownCards.has(currentCard.word) ? "secondary" : "default"} className="gap-2">
            <Check className="w-4 h-4" /> {knownCards.has(currentCard.word) ? "Known" : "Mark as Known"}
          </Button>
        )}
        <Button onClick={handleNext} variant="outline" className="gap-2">
          {currentIndex === flashcards.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-center text-sm text-gray-500 mt-4">Click the card to flip it</p>
    </div>
  );
}
