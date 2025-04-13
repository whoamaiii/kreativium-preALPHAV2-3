import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Share2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

interface QuizCompleteProps {
  score: number;
  totalQuestions: number;
  onFinish: () => void;
}

export const QuizComplete: React.FC<QuizCompleteProps> = ({
  score,
  totalQuestions,
  onFinish,
}) => {
  const navigate = useNavigate();
  const percentage = Math.round((score / (totalQuestions * 10)) * 100);

  React.useEffect(() => {
    if (percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    onFinish();
  }, []);

  const handleShare = async () => {
    const text = `I scored ${score} points (${percentage}%) on Ask123! 🎉`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ask123 Quiz Result',
          text,
          url: window.location.href,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(text);
        }
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <Card className="p-8 text-center bg-gray-900/50 backdrop-blur-sm">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete! 🎉</h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center gap-4">
            <div>
              <p className="text-sm text-gray-400">Score</p>
              <p className="text-3xl font-bold text-white">{score}</p>
            </div>
            <div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Accuracy</p>
              <p className="text-3xl font-bold text-white">{percentage}%</p>
            </div>
          </div>

          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button onClick={() => navigate('/quiz')}>
            Try Another Quiz
          </Button>
          <Button variant="secondary" onClick={handleShare}>
            <Share2 className="w-5 h-5 mr-2" />
            Share Result
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};