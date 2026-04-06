import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { track, trackBeacon } from '../services/analyticsService';
import type { QuizStepConfig } from '../types/quiz';
import { ProgressBar } from '../components/quiz/ProgressBar';
import { SingleSelectCard } from '../components/quiz/StepTypes/SingleSelectCard';
import { SingleSelectEmoji } from '../components/quiz/StepTypes/SingleSelectEmoji';
import { SingleSelectText } from '../components/quiz/StepTypes/SingleSelectText';
import { MultiSelectCheckbox } from '../components/quiz/StepTypes/MultiSelectCheckbox';
import { EmojiScale } from '../components/quiz/StepTypes/EmojiScale';
import { NameInput } from '../components/quiz/StepTypes/NameInput';
import { BirthDatePicker } from '../components/quiz/StepTypes/BirthDatePicker';
import { PalmistryCapture } from '../components/quiz/StepTypes/PalmistryCapture';
import { PalmistryAnalysis } from '../components/quiz/StepTypes/PalmistryAnalysis';
import { LoadingScreen } from '../components/quiz/StepTypes/LoadingScreen';
import { EmailCapture } from '../components/quiz/StepTypes/EmailCapture';
import { ResultPage } from '../components/quiz/StepTypes/ResultPage';
import { MicroVSL } from '../components/quiz/StepTypes/MicroVSL';
import { Paywall } from '../components/quiz/StepTypes/Paywall';
import { PaywallB } from '../components/quiz/StepTypes/PaywallB';

// Steps where back button should be hidden
const NO_BACK_STEPS = new Set([1, 10, 11, 13, 14, 15, 16, 17]);

// Steps that have a dark bg
const DARK_BG_STEPS = new Set([4, 10, 11]);

interface QuizFlowProps {
  config: QuizStepConfig[];
  returnPath?: string; // where to redirect if no session (default '/')
}

export function QuizFlow({ config, returnPath = '/' }: QuizFlowProps) {
  const { currentStep, sessionToken, nextStep, previousStep, palmistrySkipped } = useQuizStore();
  const navigate = useNavigate();
  const stepStartRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!sessionToken) {
      navigate(returnPath);
    }
  }, [sessionToken, navigate, returnPath]);

  // Auto-skip palmistry analysis if user skipped palmistry capture
  useEffect(() => {
    if (currentStep === 11 && palmistrySkipped) {
      nextStep();
    }
  }, [currentStep, palmistrySkipped, nextStep]);

  // Track screen_loaded on every step change, and time_on_screen when leaving
  useEffect(() => {
    if (!sessionToken || currentStep === 0) return;
    stepStartRef.current = Date.now();

    track({
      session_id: sessionToken,
      event_type: 'screen_loaded',
      screen_id: currentStep,
    });

    return () => {
      const elapsed = Math.round((Date.now() - stepStartRef.current) / 1000);
      track({
        session_id: sessionToken,
        event_type: 'screen_time',
        screen_id: currentStep,
        time_on_screen: elapsed,
      });
    };
  }, [currentStep, sessionToken]);

  // Track quiz abandonment via beforeunload and visibilitychange
  useEffect(() => {
    if (!sessionToken || currentStep === 0) return;

    const handleAbandon = () => {
      trackBeacon({
        session_id: sessionToken,
        event_type: 'quiz_abandoned',
        screen_id: currentStep,
        time_on_screen: Math.round((Date.now() - stepStartRef.current) / 1000),
      });
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') handleAbandon();
    };

    window.addEventListener('beforeunload', handleAbandon);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('beforeunload', handleAbandon);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [sessionToken, currentStep]);

  if (!sessionToken || currentStep === 0) return null;

  const stepConfig = config[currentStep - 1];
  if (!stepConfig) return null;

  const totalSteps = config.length;
  const showBack = currentStep > 1 && !NO_BACK_STEPS.has(currentStep);
  const showProgress = currentStep <= 9;
  const isDark = DARK_BG_STEPS.has(currentStep);

  const renderStep = () => {
    const props = { step: currentStep, onNext: nextStep };

    switch (stepConfig.type) {
      case 'single-select-card':
        return <SingleSelectCard {...props} question={stepConfig.question!} options={stepConfig.options!} subtitle={stepConfig.subtitle} />;
      case 'single-select-emoji':
        return <SingleSelectEmoji {...props} question={stepConfig.question!} options={stepConfig.options!} confirmLabel={stepConfig.confirmLabel} />;
      case 'single-select-text':
        return <SingleSelectText {...props} question={stepConfig.question!} options={stepConfig.options!} variant={stepConfig.variant} />;
      case 'multi-select':
        return <MultiSelectCheckbox {...props} question={stepConfig.question!} options={stepConfig.options!} subtitle={stepConfig.subtitle} minSelect={stepConfig.minSelect} />;
      case 'emoji-scale':
        return <EmojiScale {...props} question={stepConfig.question!} subtitle={stepConfig.subtitle} />;
      case 'name-input':
        return <NameInput {...props} />;
      case 'birth-date':
        return <BirthDatePicker {...props} />;
      case 'palmistry-capture':
        return <PalmistryCapture {...props} variant={stepConfig.variant} />;
      case 'palmistry-analysis':
        return <PalmistryAnalysis onNext={nextStep} variant={stepConfig.variant} />;
      case 'loading':
        return <LoadingScreen onComplete={nextStep} />;
      case 'email-capture':
        return <EmailCapture {...props} />;
      case 'result':
        return <ResultPage {...props} />;
      case 'micro-vsl':
        return <MicroVSL {...props} />;
      case 'paywall':
        return <Paywall {...props} />;
      case 'paywall-b':
        return <PaywallB {...props} />;
      default:
        return null;
    }
  };

  // suppress unused var warning — totalSteps used for future progress bar extension
  void totalSteps;

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? '' : 'bg-cream-50'}`}>
      {showProgress && <ProgressBar current={currentStep} total={9} />}

      <main className="flex-1 flex items-center justify-center py-10 px-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {showBack && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={previousStep}
          className="fixed bottom-6 left-6 text-sm text-gray-400 hover:text-gold-600 transition-colors"
        >
          ← Voltar
        </motion.button>
      )}
    </div>
  );
}
