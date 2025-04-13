import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Brain, HandMetal, Plus, BookOpen } from 'lucide-react';
import { Card } from './ui/Card';
import { useProgress } from '../hooks/useProgress';
import { LevelProgress } from './LevelProgress';

export const MainContent: React.FC = () => {
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
      color: 'text-green-500',
      link: '/custom',
      bgGlow: 'before:bg-green-500/20',
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <LevelProgress
        level={progress.level}
        xp={progress.xp}
        totalXp={400}
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
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

      <Card 
        onClick={() => window.open('https://www.minetegn.no/Tegnordbok-2016/', '_blank')}
        className={`
          relative p-8 text-center overflow-hidden
          bg-gray-900/50 backdrop-blur-sm hover:shadow-lg
          transition-all cursor-pointer group
          before:absolute before:inset-0 before:opacity-0
          before:transition-opacity before:rounded-lg
          before:blur-xl before:bg-emerald-500/20
          group-hover:before:opacity-100
        `}
      >
        <div className="relative z-10">
          <BookOpen className="w-12 h-12 text-emerald-500 mx-auto mb-4 group-hover:text-emerald-400 transition-colors" />
          <h2 className="text-2xl font-bold mb-2 text-white">Tegnordbok</h2>
          <p className="text-gray-400 mb-4">
            Utforsk den offisielle norske tegnordboken for å lære flere tegn
          </p>
          <span className="inline-block text-emerald-400 group-hover:text-emerald-300 transition-colors">
            Åpne Tegnordbok →
          </span>
        </div>
      </Card>
    </main>
  );
};