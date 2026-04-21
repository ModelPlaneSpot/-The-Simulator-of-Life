import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, ChevronLeft, X, Sparkles, Target, BookOpen, DollarSign, Users, Heart, Globe, Shield, Briefcase, GraduationCap, Activity } from 'lucide-react';

export interface TutorialStep {
  target: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlightArea?: 'age-button' | 'tab-activities' | 'tab-education' | 'tab-occupation' | 'tab-assets' | 'tab-family' | 'tab-finance' | 'tab-lifestyle' | 'tab-crime' | 'stats-panel' | 'logs-area' | 'help-button';
  tip?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    target: 'welcome',
    title: 'Welcome to Life Simulator!',
    description: 'You\'ve just been born into this world. This tutorial will walk you through everything you need to know to live your best life. Let\'s get started!',
    icon: <Sparkles className="w-5 h-5" />,
    tip: 'You can replay this tutorial anytime by clicking the "?" button.',
  },
  {
    target: 'stats-panel',
    title: 'Your Character Stats',
    description: 'This panel shows your vital stats: Health, Smarts, Happiness, Looks, and more. Every decision affects these. Keep them high to unlock better opportunities!',
    icon: <Heart className="w-5 h-5" />,
    highlightArea: 'stats-panel',
    tip: 'Low health can lead to hospital visits. Low happiness can cause depression events.',
  },
  {
    target: 'age-button',
    title: 'Age Up — Your Core Action',
    description: 'Press this button to advance one year. Random life events will happen, your stats will shift, and time moves forward. This is the heartbeat of the game!',
    icon: <Target className="w-5 h-5" />,
    highlightArea: 'age-button',
    tip: 'Try aging up a few times after the tutorial to see childhood events.',
  },
  {
    target: 'logs-area',
    title: 'Life Events Log',
    description: 'Everything that happens appears here. Green = good, red = bad, yellow = warning, blue = info. Scroll up to review your whole life story.',
    icon: <BookOpen className="w-5 h-5" />,
    highlightArea: 'logs-area',
    tip: 'Pay attention to scenario pop-ups — your choices matter!',
  },
  {
    target: 'tab-activities',
    title: 'Activities — Stay Active!',
    description: 'Visit the gym, meditate, go to the library, see a doctor, or travel. Each activity affects your stats. Staying active is key to a long, happy life.',
    icon: <Activity className="w-5 h-5" />,
    highlightArea: 'tab-activities',
    tip: '💡 Try "Go to the Library" — it boosts Smarts for free!',
  },
  {
    target: 'tab-education',
    title: 'Education & Languages',
    description: 'Enroll in school to unlock better careers. You can also learn new languages here! Languages boost your salary and open social doors.',
    icon: <GraduationCap className="w-5 h-5" />,
    highlightArea: 'tab-education',
    tip: '💡 Pick a language to study — it pays off with salary bonuses later!',
  },
  {
    target: 'tab-occupation',
    title: 'Occupation — Earn Money',
    description: 'Find a job to earn income. Better education and higher stats unlock prestigious, high-paying careers. Everyone starts somewhere!',
    icon: <Briefcase className="w-5 h-5" />,
    highlightArea: 'tab-occupation',
    tip: '💡 Apply for your first job as soon as you turn 16.',
  },
  {
    target: 'tab-assets',
    title: 'Assets & Business Empire',
    description: 'Buy houses, cars, start businesses, and build your empire! Real estate generates rental income, businesses become your wealth engine.',
    icon: <DollarSign className="w-5 h-5" />,
    highlightArea: 'tab-assets',
    tip: 'Save up and buy property — rental income is passive money every year.',
  },
  {
    target: 'tab-family',
    title: 'Family & Relationships',
    description: 'Manage relationships with parents, find a partner, get married, and have children. Strong bonds boost happiness and unlock special events.',
    icon: <Users className="w-5 h-5" />,
    highlightArea: 'tab-family',
    tip: 'Spend time with parents early — it builds bonds that last a lifetime.',
  },
  {
    target: 'tab-finance',
    title: 'Finance — Manage Wealth',
    description: 'Track income, expenses, savings, and investments. Take loans, manage debt, plan for retirement. Financial literacy is key!',
    icon: <DollarSign className="w-5 h-5" />,
    highlightArea: 'tab-finance',
    tip: 'Avoid unnecessary debt early — interest adds up fast!',
  },
  {
    target: 'tab-lifestyle',
    title: 'Lifestyle Choices',
    description: 'Choose how you live — diet, hobbies, social life all affect your stats. Make choices that align with the life you want.',
    icon: <Globe className="w-5 h-5" />,
    highlightArea: 'tab-lifestyle',
    tip: 'A healthy lifestyle keeps Health and Happiness high as you age.',
  },
  {
    target: 'tab-crime',
    title: 'Crime — The Risky Path',
    description: 'You can choose a life of crime... but beware. Getting caught means jail, fines, and ruined relationships. High risk, sometimes high reward.',
    icon: <Shield className="w-5 h-5" />,
    highlightArea: 'tab-crime',
    tip: 'A criminal record blocks future job opportunities!',
  },
  {
    target: 'help-button',
    title: 'Replay Tutorial Anytime',
    description: 'See the "?" button in the top-right of your character panel? Click it anytime to replay this tutorial. It\'s always there when you need a refresher!',
    icon: <BookOpen className="w-5 h-5" />,
    highlightArea: 'help-button',
    tip: 'The "?" button is always available in your sidebar header.',
  },
  {
    target: 'summary',
    title: 'You\'re Ready! 🎮',
    description: 'Start by aging up a few years, try activities, enroll in school, and watch your life unfold. Every playthrough is unique. Good luck!',
    icon: <Sparkles className="w-5 h-5" />,
    tip: 'Pro tip: Balance stats, save money, invest in education, enjoy the journey!',
  },
];

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TutorialProps {
  onComplete: () => void;
  onTabChange: (tab: string) => void;
  onHighlightChange?: (area: string | undefined) => void;
}

export default function Tutorial({ onComplete, onTabChange, onHighlightChange }: TutorialProps) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const currentStep = TUTORIAL_STEPS[step];

  const PAD = 8; // padding around highlighted element

  // Measure the target element position
  const measureTarget = useCallback(() => {
    if (!currentStep?.highlightArea) {
      setTargetRect(null);
      return;
    }
    // Map tab-specific highlights to the whole tab panel element
    const dataAttr = currentStep.highlightArea.startsWith('tab-')
      ? 'tab-panel'
      : currentStep.highlightArea;
    const el = document.querySelector(`[data-tutorial="${dataAttr}"]`);
    if (el) {
      const r = el.getBoundingClientRect();
      setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    } else {
      setTargetRect(null);
    }
  }, [currentStep]);

  // Switch tabs and notify parent on step change
  useEffect(() => {
    const tabMap: Record<string, string> = {
      'tab-activities': 'activities',
      'tab-education': 'education',
      'tab-occupation': 'occupation',
      'tab-assets': 'assets',
      'tab-family': 'family',
      'tab-finance': 'finance',
      'tab-lifestyle': 'lifestyle',
      'tab-crime': 'crime',
    };
    if (currentStep?.highlightArea && tabMap[currentStep.highlightArea]) {
      onTabChange(tabMap[currentStep.highlightArea]);
    }
    onHighlightChange?.(currentStep?.highlightArea);

    // Measure after a brief delay to let layout settle (e.g. tab switch)
    const t1 = setTimeout(measureTarget, 50);
    const t2 = setTimeout(measureTarget, 200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [step, currentStep, onTabChange, onHighlightChange, measureTarget]);

  // Re-measure on resize/scroll
  useEffect(() => {
    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget, true);
    return () => {
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget, true);
    };
  }, [measureTarget]);

  const nextStep = () => {
    if (step < TUTORIAL_STEPS.length - 1) setStep(step + 1);
    else onComplete();
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const progress = ((step + 1) / TUTORIAL_STEPS.length) * 100;

  // Build an SVG overlay with a cutout hole for the highlighted element
  const renderOverlay = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (targetRect) {
      const x = targetRect.left - PAD;
      const y = targetRect.top - PAD;
      const w = targetRect.width + PAD * 2;
      const h = targetRect.height + PAD * 2;
      const r = 12;

      return (
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          <defs>
            <mask id="tutorial-mask">
              <rect x="0" y="0" width={vw} height={vh} fill="white" />
              <rect x={x} y={y} width={w} height={h} rx={r} ry={r} fill="black" />
            </mask>
          </defs>
          <rect
            x="0" y="0" width={vw} height={vh}
            fill="rgba(0,0,0,0.65)"
            mask="url(#tutorial-mask)"
          />
        </svg>
      );
    }

    // No highlight — solid overlay
    return (
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          pointerEvents: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      />
    );
  };

  // Spotlight ring around the target
  const renderSpotlightRing = () => {
    if (!targetRect) return null;
    return (
      <div
        style={{
          position: 'absolute',
          top: targetRect.top - PAD,
          left: targetRect.left - PAD,
          width: targetRect.width + PAD * 2,
          height: targetRect.height + PAD * 2,
          borderRadius: '12px',
          border: '2px solid rgba(99, 102, 241, 0.7)',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.3), inset 0 0 20px rgba(99, 102, 241, 0.05)',
          pointerEvents: 'none',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    );
  };

  // Compute card position relative to the target element
  const getCardStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const cardW = 370;
    const cardH = 280;
    const gap = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Try right of element
    const rightX = targetRect.left + targetRect.width + PAD + gap;
    if (rightX + cardW < vw - 16) {
      const topY = Math.max(16, Math.min(targetRect.top, vh - cardH - 16));
      return { top: `${topY}px`, left: `${rightX}px` };
    }

    // Try left of element
    const leftX = targetRect.left - PAD - gap - cardW;
    if (leftX > 16) {
      const topY = Math.max(16, Math.min(targetRect.top, vh - cardH - 16));
      return { top: `${topY}px`, left: `${leftX}px` };
    }

    // Try above element
    const aboveY = targetRect.top - PAD - gap - cardH;
    if (aboveY > 16) {
      const leftPos = Math.max(16, Math.min(targetRect.left, vw - cardW - 16));
      return { top: `${aboveY}px`, left: `${leftPos}px` };
    }

    // Below element
    const belowY = targetRect.top + targetRect.height + PAD + gap;
    const leftPos = Math.max(16, Math.min(targetRect.left, vw - cardW - 16));
    return { top: `${Math.min(belowY, vh - cardH - 16)}px`, left: `${leftPos}px` };
  };

  return createPortal(
    <div id="tutorial-root" style={{ position: 'fixed', inset: 0, zIndex: 100001, pointerEvents: 'none' }}>
      {/* Overlay with cutout */}
      {renderOverlay()}

      {/* Spotlight ring */}
      {renderSpotlightRing()}

      {/* Tutorial Card */}
      <div
        ref={cardRef}
        style={{
          position: 'absolute',
          zIndex: 2,
          pointerEvents: 'auto',
          transition: 'top 0.35s cubic-bezier(0.4,0,0.2,1), left 0.35s cubic-bezier(0.4,0,0.2,1)',
          ...getCardStyle(),
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #18181b 50%, #1e1b4b 100%)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.15)',
          width: '360px',
          maxWidth: '92vw',
          overflow: 'hidden',
        }}>
          {/* Progress bar */}
          <div style={{ height: '3px', background: '#27272a' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              transition: 'width 0.5s ease',
            }} />
          </div>

          <div style={{ padding: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#818cf8',
                }}>
                  {currentStep.icon}
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Step {step + 1} of {TUTORIAL_STEPS.length}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f4f4f5', margin: 0, lineHeight: 1.3 }}>
                    {currentStep.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={onComplete}
                style={{
                  padding: '6px', color: '#71717a', background: 'transparent', border: 'none',
                  cursor: 'pointer', borderRadius: '8px',
                }}
                title="Skip tutorial"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: 1.6, margin: '0 0 12px 0' }}>
              {currentStep.description}
            </p>

            {/* Tip box */}
            {currentStep.tip && (
              <div style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '10px',
                padding: '8px 12px',
                marginBottom: '16px',
              }}>
                <p style={{ color: '#a5b4fc', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
                  {currentStep.tip}
                </p>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Step dots */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {TUTORIAL_STEPS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === step ? '16px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      transition: 'all 0.3s ease',
                      background: i === step ? '#6366f1' : i < step ? 'rgba(99, 102, 241, 0.4)' : '#3f3f46',
                    }}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {step > 0 && (
                  <button
                    onClick={prevStep}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '6px 12px', color: '#a1a1aa', background: 'transparent',
                      border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                      borderRadius: '8px',
                    }}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                )}
                <button
                  onClick={nextStep}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                    color: 'white', border: 'none', cursor: 'pointer',
                    fontSize: '13px', fontWeight: 600, borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  {step < TUTORIAL_STEPS.length - 1 ? (
                    <>Next <ChevronRight className="w-3.5 h-3.5" /></>
                  ) : (
                    '🎮 Start Playing!'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
