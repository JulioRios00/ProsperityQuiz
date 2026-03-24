import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { quizConfig } from '../config/quizConfig';
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
import { Checkout } from '../components/quiz/StepTypes/Checkout';

// Steps where back button should be hidden
const NO_BACK_STEPS = new Set([1, 10, 11, 13, 14, 15, 16, 17]);

// Steps that have a dark bg (palmistry + birth date)
const DARK_BG_STEPS = new Set([4, 10, 11]);

export function QuizFlow() {
  const { currentStep, sessionToken, nextStep, previousStep, palmistrySkipped } = useQuizStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionToken) {
      navigate('/');
    }
  }, [sessionToken, navigate]);

  // Auto-skip palmistry analysis if user skipped palmistry capture
  useEffect(() => {
    if (currentStep === 11 && palmistrySkipped) {
      nextStep();
    }
  }, [currentStep, palmistrySkipped, nextStep]);

  if (!sessionToken || currentStep === 0) return null;

  const config = quizConfig[currentStep - 1];
  const showBack = currentStep > 1 && !NO_BACK_STEPS.has(currentStep);
  const showProgress = currentStep <= 9; // show for first 9 steps
  const isDark = DARK_BG_STEPS.has(currentStep);

  const renderStep = () => {
    const props = { step: currentStep, onNext: nextStep };

    switch (config.type) {
      case 'single-select-card':
        return <SingleSelectCard {...props} question={config.question!} options={config.options!} subtitle={config.subtitle} />;
      case 'single-select-emoji':
        return <SingleSelectEmoji {...props} question={config.question!} options={config.options!} />;
      case 'single-select-text':
        return <SingleSelectText {...props} question={config.question!} options={config.options!} variant={config.variant} />;
      case 'multi-select':
        return <MultiSelectCheckbox {...props} question={config.question!} options={config.options!} subtitle={config.subtitle} minSelect={config.minSelect} />;
      case 'emoji-scale':
        return <EmojiScale {...props} question={config.question!} subtitle={config.subtitle} />;
      case 'name-input':
        return <NameInput {...props} />;
      case 'birth-date':
        return <BirthDatePicker {...props} />;
      case 'palmistry-capture':
        return <PalmistryCapture {...props} />;
      case 'palmistry-analysis':
        return <PalmistryAnalysis onNext={nextStep} />;
      case 'loading':
        return <LoadingScreen onComplete={nextStep} />;
      case 'email-capture':
        return <EmailCapture {...props} />;
      case 'result':
        return <ResultPage {...props} />;
      case 'micro-vsl':
        return <MicroVSL {...props} />;
      case 'checkout':
        return <Checkout />;
      default:
        return null;
    }
  };

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
