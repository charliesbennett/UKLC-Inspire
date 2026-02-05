'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

interface RestaurantDesign {
  name: string;
  theme: string;
  location: string;
  specialFeatures: string;
  targetAudience: string;
  foodType: string;
  pitch: string;
  posterIdea: string;
}

type Step = 'intro' | 'basic' | 'features' | 'marketing' | 'review';

const themeIdeas = [
  "Underwater dining",
  "Zero gravity space station",
  "Time travel through different eras",
  "Reverse restaurant (dessert first)",
  "Silent restaurant (no talking allowed)",
  "Mystery dining (surprise dishes)",
  "Video game themed",
  "Upside-down restaurant",
  "Your own original idea"
];

export default function RestaurantDesignActivity() {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [design, setDesign] = useState<RestaurantDesign>({
    name: '',
    theme: '',
    location: '',
    specialFeatures: '',
    targetAudience: '',
    foodType: '',
    pitch: '',
    posterIdea: ''
  });

  const updateDesign = (field: keyof RestaurantDesign, value: string) => {
    setDesign({ ...design, [field]: value });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'intro':
        return true;
      case 'basic':
        return design.name && design.theme && design.location;
      case 'features':
        return design.specialFeatures && design.targetAudience && design.foodType;
      case 'marketing':
        return design.pitch && design.posterIdea;
      default:
        return true;
    }
  };

  const nextStep = () => {
    const steps: Step[] = ['intro', 'basic', 'features', 'marketing', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const previousStep = () => {
    const steps: Step[] = ['intro', 'basic', 'features', 'marketing', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const renderIntro = () => (
    <Card>
      <CardHeader>
        <CardTitle>Design Your Own Crazy Restaurant! 🍽️</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-lg mb-4">
            You've learned about some of the world's craziest restaurants. Now it's your turn to design one!
          </p>
          <p className="mb-4">
            Think about what would make YOUR restaurant unique and unforgettable. What experience would you create?
          </p>
        </div>

        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            Be creative! The best restaurant concepts are unique, memorable, and give people an experience they can't get anywhere else.
          </AlertDescription>
        </Alert>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">You'll need to create:</h3>
          <ul className="space-y-1 text-sm">
            <li>✅ A name for your restaurant</li>
            <li>✅ A unique theme or concept</li>
            <li>✅ Special features that make it stand out</li>
            <li>✅ A pitch to convince people to visit</li>
            <li>✅ Ideas for advertising</li>
          </ul>
        </div>

        <Button onClick={nextStep} className="w-full gap-2">
          Start Designing <ChevronRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );

  const renderBasicInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-base mb-2 block">
            Restaurant Name *
          </Label>
          <Input
            id="name"
            value={design.name}
            onChange={(e) => updateDesign('name', e.target.value)}
            placeholder="e.g., The Floating Feast, Dine in the Dark, etc."
            className="text-lg"
          />
          <p className="text-sm text-gray-500 mt-1">Make it catchy and memorable!</p>
        </div>

        <div>
          <Label className="text-base mb-3 block">Theme or Concept *</Label>
          <RadioGroup value={design.theme} onValueChange={(value) => updateDesign('theme', value)}>
            {themeIdeas.map((theme, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                <RadioGroupItem value={theme} id={`theme-${index}`} />
                <Label htmlFor={`theme-${index}`} className="cursor-pointer flex-1">
                  {theme}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {design.theme === "Your own original idea" && (
            <Input
              value={design.theme === "Your own original idea" ? design.location : design.theme}
              onChange={(e) => updateDesign('theme', e.target.value)}
              placeholder="Describe your original theme..."
              className="mt-2"
            />
          )}
        </div>

        <div>
          <Label htmlFor="location" className="text-base mb-2 block">
            Where would your restaurant be located? *
          </Label>
          <Input
            id="location"
            value={design.location}
            onChange={(e) => updateDesign('location', e.target.value)}
            placeholder="e.g., London, Tokyo, floating on the ocean, in a cave..."
          />
          <p className="text-sm text-gray-500 mt-1">Location can add to the uniqueness!</p>
        </div>

        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            Think about how your location connects to your theme. A space-themed restaurant might be in a planetarium!
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  const renderFeatures = () => (
    <Card>
      <CardHeader>
        <CardTitle>Special Features</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="features" className="text-base mb-2 block">
            What makes your restaurant special or unique? *
          </Label>
          <Textarea
            id="features"
            value={design.specialFeatures}
            onChange={(e) => updateDesign('specialFeatures', e.target.value)}
            placeholder="Describe the unique features, atmosphere, service style, or experiences..."
            rows={5}
            className="resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            Think about: décor, service style, entertainment, technology, interactive elements
          </p>
        </div>

        <div>
          <Label htmlFor="audience" className="text-base mb-2 block">
            Who is your target audience? *
          </Label>
          <Input
            id="audience"
            value={design.targetAudience}
            onChange={(e) => updateDesign('targetAudience', e.target.value)}
            placeholder="e.g., adventurous adults, families with children, tourists..."
          />
        </div>

        <div>
          <Label htmlFor="food" className="text-base mb-2 block">
            What type of food would you serve? *
          </Label>
          <Input
            id="food"
            value={design.foodType}
            onChange={(e) => updateDesign('foodType', e.target.value)}
            placeholder="e.g., gourmet fine dining, comfort food, international cuisine..."
          />
          <p className="text-sm text-gray-500 mt-1">
            How does the food match your theme?
          </p>
        </div>

        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            Consider: Would people find this appealing or off-putting? What makes it worth the visit?
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  const renderMarketing = () => (
    <Card>
      <CardHeader>
        <CardTitle>Marketing Your Restaurant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="pitch" className="text-base mb-2 block">
            Your Pitch: Convince people to visit! *
          </Label>
          <Textarea
            id="pitch"
            value={design.pitch}
            onChange={(e) => updateDesign('pitch', e.target.value)}
            placeholder="Write a compelling pitch that would make people want to try your restaurant. What experience will they have? Why should they choose your restaurant?"
            rows={6}
            className="resize-none"
          />
          <div className="text-sm text-gray-500 mt-2 space-y-1">
            <p>Your pitch should include:</p>
            <ul className="list-disc list-inside pl-2">
              <li>What makes your restaurant unique</li>
              <li>The experience customers will have</li>
              <li>Why it's worth visiting</li>
            </ul>
          </div>
        </div>

        <div>
          <Label htmlFor="poster" className="text-base mb-2 block">
            Advertising Poster/Video Idea *
          </Label>
          <Textarea
            id="poster"
            value={design.posterIdea}
            onChange={(e) => updateDesign('posterIdea', e.target.value)}
            placeholder="Describe your poster or video concept. What images, colors, or slogans would you use to advertise?"
            rows={4}
            className="resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            Think visually! What would catch people's attention on social media or on a billboard?
          </p>
        </div>

        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            Use persuasive language! Think about: "Imagine...", "Experience...", "Discover...", "The only place where..."
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  const renderReview = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          Your Restaurant Design
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-green-50 border-green-300">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Great work! Review your restaurant concept below. You can go back to edit any section.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="font-bold text-lg mb-1">{design.name}</h3>
            <p className="text-sm text-gray-600">{design.location}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-1">THEME</h4>
            <p>{design.theme}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-1">SPECIAL FEATURES</h4>
            <p>{design.specialFeatures}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-1">TARGET AUDIENCE</h4>
            <p>{design.targetAudience}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-1">FOOD TYPE</h4>
            <p>{design.foodType}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">THE PITCH</h4>
            <p className="italic">"{design.pitch}"</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-1">ADVERTISING CONCEPT</h4>
            <p>{design.posterIdea}</p>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold mb-2">💡 Discussion Questions</h4>
          <ul className="text-sm space-y-2">
            <li>• Would you actually visit this restaurant? Why or why not?</li>
            <li>• What might people find appealing about it?</li>
            <li>• What might people find off-putting?</li>
            <li>• How could you improve the concept?</li>
          </ul>
        </div>

        <Button className="w-full" onClick={() => {
          // In a real app, this would save to database or allow sharing
          alert('Your restaurant design has been saved! In the full app, you could share this with your classmates.');
        }}>
          Save & Share Design
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          {(['intro', 'basic', 'features', 'marketing', 'review'] as Step[]).map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${currentStep === step ? 'bg-blue-600 text-white' : 
                  index < (['intro', 'basic', 'features', 'marketing', 'review'] as Step[]).indexOf(currentStep) 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'}
              `}>
                {index < (['intro', 'basic', 'features', 'marketing', 'review'] as Step[]).indexOf(currentStep) ? '✓' : index + 1}
              </div>
              {index < 4 && (
                <div className={`flex-1 h-1 mx-2 ${
                  index < (['intro', 'basic', 'features', 'marketing', 'review'] as Step[]).indexOf(currentStep)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600 px-2">
          <span>Intro</span>
          <span>Basic</span>
          <span>Features</span>
          <span>Marketing</span>
          <span>Review</span>
        </div>
      </div>

      {/* Content */}
      {currentStep === 'intro' && renderIntro()}
      {currentStep === 'basic' && renderBasicInfo()}
      {currentStep === 'features' && renderFeatures()}
      {currentStep === 'marketing' && renderMarketing()}
      {currentStep === 'review' && renderReview()}

      {/* Navigation */}
      {currentStep !== 'intro' && (
        <div className="flex justify-between mt-6">
          <Button onClick={previousStep} variant="outline" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          {currentStep !== 'review' && (
            <Button onClick={nextStep} disabled={!canProceed()} className="gap-2">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
