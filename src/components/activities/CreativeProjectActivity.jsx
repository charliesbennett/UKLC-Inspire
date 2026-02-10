import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

/**
 * Data-driven Creative Project Activity.
 *
 * Props:
 *   content.title        — project title (e.g. "Design Your Own Crazy Restaurant!")
 *   content.intro        — intro paragraph
 *   content.tip          — creative tip shown on intro page
 *   content.checklist    — array of strings (what they'll create)
 *   content.steps        — array of {
 *     title: string,
 *     fields: array of {
 *       key: string,            // unique field key for state
 *       label: string,
 *       placeholder: string,
 *       type: 'text' | 'textarea' | 'radio',
 *       options?: string[],     // for radio type
 *       required?: boolean,
 *       tip?: string,
 *       minLength?: number      // for scoring (default 0)
 *     }
 *   }
 *   content.discussionQuestions — array of strings (shown on review page)
 *   onComplete(score)
 *   onProgress(score)
 */
export default function CreativeProjectActivity({ content, onComplete, onProgress }) {
  const config = content || {};
  const steps = config.steps || [];
  const allFields = steps.flatMap(s => s.fields || []);

  const [currentStep, setCurrentStep] = useState('intro');  // 'intro', 0, 1, 2..., 'review'
  const [design, setDesign] = useState(() => {
    const initial = {};
    allFields.forEach(f => { initial[f.key] = ''; });
    return initial;
  });

  const updateDesign = (key, value) => setDesign({ ...design, [key]: value });

  const calculateScore = () => {
    const checks = allFields.map(f => {
      const val = (design[f.key] || '').trim();
      const minLen = f.minLength || (f.type === 'textarea' ? 20 : 1);
      return val.length >= minLen;
    });
    return checks.length > 0 ? Math.round((checks.filter(Boolean).length / checks.length) * 100) : 100;
  };

  const canProceed = () => {
    if (currentStep === 'intro' || currentStep === 'review') return true;
    const step = steps[currentStep];
    if (!step) return true;
    return step.fields
      .filter(f => f.required !== false)
      .every(f => (design[f.key] || '').trim().length > 0);
  };

  const nextStep = () => {
    if (currentStep === 'intro') {
      setCurrentStep(0);
    } else if (typeof currentStep === 'number' && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      onProgress?.(calculateScore());
    } else if (typeof currentStep === 'number') {
      setCurrentStep('review');
      onProgress?.(calculateScore());
    }
  };

  const previousStep = () => {
    if (currentStep === 'review') {
      setCurrentStep(steps.length - 1);
    } else if (typeof currentStep === 'number' && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (currentStep === 0) {
      setCurrentStep('intro');
    }
  };

  const handleFinish = () => {
    onComplete?.(calculateScore());
  };

  const stepNames = ['Intro', ...steps.map(s => s.title), 'Review'];
  const stepIndex = currentStep === 'intro' ? 0
    : currentStep === 'review' ? stepNames.length - 1
    : currentStep + 1;

  // ── Render intro ──
  if (currentStep === 'intro') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <StepIndicator steps={stepNames} current={stepIndex} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{config.title || 'Creative Project'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">{config.intro || 'Time to get creative!'}</p>

            {config.tip && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>{config.tip}</AlertDescription>
              </Alert>
            )}

            {config.checklist && config.checklist.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">You'll need to create:</h3>
                <ul className="space-y-1 text-sm">
                  {config.checklist.map((item, i) => <li key={i}>✅ {item}</li>)}
                </ul>
              </div>
            )}

            <Button onClick={nextStep} className="w-full gap-2">
              Start <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Render review ──
  if (currentStep === 'review') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <StepIndicator steps={stepNames} current={stepIndex} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Your Design
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-green-50 border-green-300">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Great work! Review your project below. You can go back to edit any section.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {allFields.map((f) => (
                <div key={f.key}>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">{f.label.toUpperCase()}</h4>
                  <p>{design[f.key] || '—'}</p>
                </div>
              ))}
            </div>

            {config.discussionQuestions && config.discussionQuestions.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold mb-2">💡 Discussion Questions</h4>
                <ul className="text-sm space-y-2">
                  {config.discussionQuestions.map((q, i) => <li key={i}>• {q}</li>)}
                </ul>
              </div>
            )}

            <Button className="w-full" onClick={handleFinish}>
              Save & Complete
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button onClick={previousStep} variant="outline" className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      </div>
    );
  }

  // ── Render form step ──
  const step = steps[currentStep];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <StepIndicator steps={stepNames} current={stepIndex} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{step.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step.fields.map((field) => (
            <div key={field.key}>
              <Label className="text-base mb-2 block">
                {field.label} {field.required !== false && '*'}
              </Label>

              {field.type === 'radio' && field.options ? (
                <RadioGroup value={design[field.key]} onValueChange={(v) => updateDesign(field.key, v)}>
                  {field.options.map((opt, i) => (
                    <div key={i} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                      <RadioGroupItem value={opt} id={`${field.key}-${i}`} />
                      <Label htmlFor={`${field.key}-${i}`} className="cursor-pointer flex-1">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : field.type === 'textarea' ? (
                <Textarea
                  value={design[field.key]}
                  onChange={(e) => updateDesign(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={5}
                  className="resize-none"
                />
              ) : (
                <Input
                  value={design[field.key]}
                  onChange={(e) => updateDesign(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}

              {field.tip && (
                <p className="text-sm text-gray-500 mt-1">{field.tip}</p>
              )}
            </div>
          ))}

          {step.hint && (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>{step.hint}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button onClick={previousStep} variant="outline" className="gap-2">
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <Button onClick={nextStep} disabled={!canProceed()} className="gap-2">
          Continue <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

/** Step progress indicator */
function StepIndicator({ steps, current }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
              ${index === current ? 'bg-blue-600 text-white'
                : index < current ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'}
            `}>
              {index < current ? '✓' : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${index < current ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-600 px-2">
        {steps.map((s, i) => <span key={i}>{s}</span>)}
      </div>
    </div>
  );
}
