import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { Button } from './Button';

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Velkommen til Ask123!',
    description: 'Lær tegnspråk gjennom et morsomt og engasjerende spill.',
  },
  {
    title: 'Velg Kategori',
    description: 'Start med å velge en kategori du vil lære tegn fra.',
  },
  {
    title: 'Svar på Spørsmål',
    description: 'Se på tegnet og skriv inn riktig svar.',
  },
  {
    title: 'Samle Poeng',
    description: 'Få poeng for riktige svar og bygg opp en streak!',
  },
];

export const Tutorial: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
      setCurrentStep(0);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4"
      >
        <HelpCircle className="w-5 h-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 dark:text-white">
                  {tutorialSteps[currentStep].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {tutorialSteps[currentStep].description}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep
                          ? 'bg-purple-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <Button onClick={nextStep}>
                  {currentStep === tutorialSteps.length - 1 ? 'Start Spillet' : 'Neste'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}