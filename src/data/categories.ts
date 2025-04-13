import { Category } from '../types';
import i18n from '../i18n';

// Helper function to get translated text
const getLocalizedText = (key: string) => {
  const resources = i18n.getResourceBundle(i18n.language, 'translation');
  return resources?.categories?.[key] || key;
};

export const categories: Category[] = [
  {
    id: 'colors',
    name: getLocalizedText('colors'),
    description: i18n.language === 'nb' 
      ? 'Lær tegnspråk for ulike farger' 
      : 'Learn sign language for different colors',
    icon: 'palette',
    unlockLevel: 0
  },
  {
    id: 'animals',
    name: getLocalizedText('animals'),
    description: i18n.language === 'nb'
      ? 'Lær tegnspråk for dyr'
      : 'Learn sign language for animals',
    icon: 'paw',
    unlockLevel: 0
  },
  {
    id: 'daily',
    name: getLocalizedText('daily'),
    description: i18n.language === 'nb'
      ? 'Lær tegnspråk for daglige uttrykk'
      : 'Learn sign language for daily expressions',
    icon: 'chat',
    unlockLevel: 2
  },
  {
    id: 'numbers',
    name: 'Numbers',
    description: 'Learn to sign numbers and counting',
    questionCount: 5
  }
];