import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CategorySelect } from '../components/CategorySelect';

const Memory: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">{t('memory.title')}</h1>
      <p className="text-xl text-white mb-8">{t('memory.subtitle')}</p>
      <CategorySelect
        onSelect={(categoryId) => navigate(`/memory/${categoryId}`)}
        mode="memory"
      />
    </div>
  );
};

export default Memory;
