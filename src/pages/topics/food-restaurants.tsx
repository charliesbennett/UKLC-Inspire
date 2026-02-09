import { useState } from 'react';
import VocabularyActivity from '@/components/activities/VocabularyActivity';
import ReadingActivity from '@/components/activities/ReadingActivity';
import GrammarActivity from '@/components/activities/GrammarActivity';
import RestaurantDesignActivity from '@/components/activities/RestaurantDesignActivity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ActivityType = 'menu' | 'vocabulary' | 'reading' | 'grammar' | 'design';

export default function FoodRestaurantsPage() {
  const [currentActivity, setCurrentActivity] = useState<ActivityType>('menu');

  if (currentActivity === 'vocabulary') {
    return (
      <div className="container mx-auto p-6">
        <Button onClick={() => setCurrentActivity('menu')} className="mb-4">
          ← Back to Menu
        </Button>
        <VocabularyActivity />
      </div>
    );
  }

  if (currentActivity === 'reading') {
    return (
      <div className="container mx-auto p-6">
        <Button onClick={() => setCurrentActivity('menu')} className="mb-4">
          ← Back to Menu
        </Button>
        <ReadingActivity />
      </div>
    );
  }

  if (currentActivity === 'grammar') {
    return (
      <div className="container mx-auto p-6">
        <Button onClick={() => setCurrentActivity('menu')} className="mb-4">
          ← Back to Menu
        </Button>
        <GrammarActivity />
      </div>
    );
  }

  if (currentActivity === 'design') {
    return (
      <div className="container mx-auto p-6">
        <Button onClick={() => setCurrentActivity('menu')} className="mb-4">
          ← Back to Menu
        </Button>
        <RestaurantDesignActivity />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Food & Restaurants</h1>
        <p className="text-gray-600">Crazy Restaurants Around the World</p>
        <p className="text-sm text-gray-500">Level 2 (B1-B2) • Ages 13-16</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
          onClick={() => setCurrentActivity('vocabulary')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎴 Build Vocabulary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">
              Learn 12 essential restaurant words with interactive flashcards
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">⏱️ 10-15 minutes</span>
              <span className="text-sm font-semibold text-blue-600">Start →</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
          onClick={() => setCurrentActivity('reading')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📖 Reading Comprehension
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">
              Read about 5 crazy restaurants and answer questions
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">⏱️ 15-20 minutes</span>
              <span className="text-sm font-semibold text-blue-600">Start →</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
          onClick={() => setCurrentActivity('grammar')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✍️ Grammar Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">
              Practice adjectives, adverbs, and expressing opinions
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">⏱️ 15-20 minutes</span>
              <span className="text-sm font-semibold text-blue-600">Start →</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
          onClick={() => setCurrentActivity('design')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎨 Design Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">
              Create your own crazy restaurant concept
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">⏱️ 20-30 minutes</span>
              <span className="text-sm font-semibold text-blue-600">Start →</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

5. Click **"Commit changes"**

---

## 📂 Your Structure (Pages Router):
```
src/
├── pages/
│   ├── topics/
│   │   └── food-restaurants.tsx ← Create this
│   └── (other pages)
└── components/
    └── activities/
        ├── VocabularyActivity.tsx ✅
        ├── ReadingActivity.tsx ✅
        ├── GrammarActivity.tsx ✅
        └── RestaurantDesignActivity.tsx ✅
```

---

## 🌐 Your URL:

After Vercel deploys, access it at:
```
https://uklc-inspire.vercel.app/topics/food-restaurants
