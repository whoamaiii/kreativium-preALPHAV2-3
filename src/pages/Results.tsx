import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total } = location.state || { score: 0, total: 0 };
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        <Card className="p-8 text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete! 🎉</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-4">
              <div>
                <p className="text-sm text-gray-400">Score</p>
                <p className="text-3xl font-bold text-white">{score}/{total}</p>
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
            <Button variant="secondary" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Results;