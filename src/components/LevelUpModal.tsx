import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Unlock } from 'lucide-react';
import { Button } from './Button';

interface LevelUpModalProps {
  level: number;
  unlockedCategories: string[];
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  level,
  unlockedCategories,
  onClose,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-500 rounded-full"
              initial={{
                x: Math.random() * 100 - 50 + "%",
                y: "100%",
                opacity: 0,
              }}
              animate={{
                y: "-100%",
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
          </motion.div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-4 relative"
            >
              <Trophy className="w-full h-full text-yellow-500" />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0"
              >
                <Star className="w-full h-full text-yellow-400" />
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold mb-4 dark:text-white"
            >
              Level {level} Unlocked!
            </motion.h2>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 mb-6"
            >
              {level >= 2 && (
                <div className="flex items-center justify-center gap-2 text-green-500">
                  <Unlock className="w-5 h-5" />
                  <span>New category unlocked: Animals!</span>
                </div>
              )}
              {level >= 3 && (
                <div className="flex items-center justify-center gap-2 text-purple-500">
                  <Unlock className="w-5 h-5" />
                  <span>Mystery category unlocked!</span>
                </div>
              )}
            </motion.div>

            <Button onClick={onClose} className="animate-bounce-subtle">
              Continue
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};