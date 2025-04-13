import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Brain, HandMetal, Plus, Heart, Users, Target } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useProgress } from '../hooks/useProgress';
import { LevelProgress } from '../components/LevelProgress';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();

  const menuItems = [
    {
      title: 'Quiz',
      description: 'Test dine kunnskaper i tegnspråk gjennom morsomme spørsmål',
      icon: Gamepad2,
      color: 'text-blue-500',
      link: '/quiz',
      bgGlow: 'before:bg-blue-500/20',
    },
    {
      title: 'Memory',
      description: 'Finn matchende tegn i et klassisk memory spill',
      icon: Brain,
      color: 'text-purple-500',
      link: '/memory',
      bgGlow: 'before:bg-purple-500/20',
    },
    {
      title: 'Feelings Tracker',
      description: 'Track and visualize emotions',
      icon: Heart,
      color: 'text-red-500',
      link: '/feelings-tracker',
      bgGlow: 'before:bg-red-500/20',
    },
    {
      title: 'Kids',
      description: 'Add and manage kids in the system',
      icon: Users,
      color: 'text-yellow-500',
      link: '/kids',
      bgGlow: 'before:bg-yellow-500/20',
    },
    {
      title: 'ILP',
      description: 'Individualized Learning Plan',
      icon: Target,
      color: 'text-green-500',
      link: '/ilp',
      bgGlow: 'before:bg-green-500/20',
    },
    {
      title: 'Øvelse',
      description: 'Øv på tegnspråk i ditt eget tempo med detaljerte instruksjoner',
      icon: HandMetal,
      color: 'text-pink-500',
      link: '/practice',
      bgGlow: 'before:bg-pink-500/20',
    },
    {
      title: 'Egne Quiz',
      description: 'Lag og spill dine egne quizer med egne bilder og spørsmål',
      icon: Plus,
      color: 'text-lime-500',
      link: '/custom',
      bgGlow: 'before:bg-lime-500/20',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <LevelProgress
        level={progress.level}
        xp={progress.xp}
        totalXp={400}
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Card
            key={item.title}
            onClick={() => navigate(item.link)}
            className={`
              relative p-6 overflow-hidden
              hover:scale-105 transform transition-all cursor-pointer
              bg-gray-900/50 backdrop-blur-sm group
              before:absolute before:inset-0 before:opacity-0 before:transition-opacity
              before:rounded-lg before:blur-xl group-hover:before:opacity-100
              ${item.bgGlow}
            `}
          >
            <div className="relative z-10">
              <item.icon className={`w-12 h-12 mx-auto mb-4 ${item.color} transition-colors`} />
              <h2 className="text-xl font-bold mb-2 text-white text-center">
                {item.title}
              </h2>
              <p className="text-gray-400 text-center text-sm">
                {item.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
