import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Cat, Home, Lock } from 'lucide-react';
import { Card } from './ui/Card';
import { categories } from '../data/categories';
import { cn } from '../utils/cn';

interface CategorySelectProps {
  onSelect: (categoryId: string) => void;
  mode: 'quiz' | 'memory';
}

const iconMap = {
  colors: Palette,
  animals: Cat,
  daily: Home,
};

export const CategorySelect: React.FC<CategorySelectProps> = ({ onSelect, mode }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => {
        const Icon = iconMap[category.id as keyof typeof iconMap] || Home;

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              onClick={() => onSelect(category.id)}
              className={cn(
                'relative p-6 text-center transition-all transform',
                'bg-gray-900/50 backdrop-blur-sm hover:scale-105',
                'cursor-pointer'
              )}
            >
              <Icon className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
              <p className="text-gray-400 mb-4">
                {category.description}
              </p>
              <p className="text-sm text-purple-400">
                {mode === 'memory' 
                  ? `${category.questionCount * 2} cards to match`
                  : `${category.questionCount} questions`}
              </p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};