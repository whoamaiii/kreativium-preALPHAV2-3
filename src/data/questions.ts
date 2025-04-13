import { Question } from '../types';
import i18n from '../i18n';

// Helper function to get translated text
const getLocalizedText = (en: string, nb: string) => {
  return i18n.language === 'nb' ? nb : en;
};

// Restructure to categorize questions
export const questions: Record<string, Question[]> = {
  colors: [
    {
      id: 1,
      category: "colors",
      text: getLocalizedText(
        "What sign is shown in the image?", 
        "Hvilket tegn vises i bildet?"
      ),
      imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400",
      correctAnswer: "red",
      options: ["red", "blue", "green", "yellow"],
      hint: getLocalizedText(
        "The color of a stop sign", 
        "Fargen på et stoppskilt"
      ),
      difficulty: "easy",
      points: 10,
      explanation: getLocalizedText(
        "The sign for 'red' involves touching your lips with your index finger, as lips are naturally red.",
        "Tegnet for 'rød' innebærer å berøre leppene med pekefingeren, siden lepper er naturlig røde."
      )
    },
    {
      id: 2,
      category: "colors",
      text: getLocalizedText(
        "What color is being signed?",
        "Hvilken farge blir tegnet?"
      ),
      imageUrl: "https://images.unsplash.com/photo-1550684847-75bdda21cc95?w=400",
      correctAnswer: "blue",
      options: ["purple", "blue", "black", "brown"],
      hint: getLocalizedText(
        "The color of the sky",
        "Fargen på himmelen"
      ),
      difficulty: "easy",
      points: 10,
      explanation: getLocalizedText(
        "The sign for 'blue' is made by shaking the 'B' handshape.",
        "Tegnet for 'blå' lages ved å riste 'B'-håndbevegelsen."
      )
    },
    {
      id: 3,
      category: "colors",
      text: getLocalizedText(
        "Which color sign is this?",
        "Hvilket fargetegn er dette?"
      ),
      imageUrl: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=400",
      correctAnswer: "green",
      options: ["green", "orange", "pink", "white"],
      hint: getLocalizedText(
        "The color of grass",
        "Fargen på gress"
      ),
      difficulty: "easy",
      points: 10,
      explanation: getLocalizedText(
        "The sign for 'green' mimics the movement of a plant growing.",
        "Tegnet for 'grønn' etterligner bevegelsen av en plante som vokser."
      )
    },
    {
      id: 4,
      category: "colors",
      text: getLocalizedText(
        "What is this color sign?",
        "Hva er dette fargetegnet?"
      ),
      imageUrl: "https://images.unsplash.com/photo-1550684376-db37893d6d32?w=400",
      correctAnswer: "yellow",
      options: ["orange", "yellow", "gold", "tan"],
      hint: getLocalizedText(
        "The color of the sun",
        "Fargen på solen"
      ),
      difficulty: "medium",
      points: 15,
      explanation: getLocalizedText(
        "The 'yellow' sign is made with a hand shaking in a 'Y' handshape.",
        "Tegnet for 'gul' lages med en hånd som rister i en 'Y'-håndbevegelse."
      )
    },
    {
      id: 5,
      category: "colors",
      text: getLocalizedText(
        "Which color is being shown?",
        "Hvilken farge vises?"
      ),
      imageUrl: "https://images.unsplash.com/photo-1550684376-efcbd6e3f032?w=400",
      correctAnswer: "purple",
      options: ["purple", "pink", "blue", "red"],
      hint: getLocalizedText(
        "The color of royalty",
        "Fargen på kongelighet"
      ),
      difficulty: "medium",
      points: 15,
      explanation: getLocalizedText(
        "The sign for 'purple' is made by shaking the 'P' handshape.",
        "Tegnet for 'lilla' lages ved å riste 'P'-håndbevegelsen."
      )
    }
  ],
  
  animals: [
    {
      id: 6,
      category: "animals",
      text: getLocalizedText(
        "What animal sign is shown?",
        "Hvilket dyretegn vises?"
      ),
      imageUrl: "https://images.unsplash.com/photo-1550684376-efcbd6e3f033?w=400",
      correctAnswer: "dog",
      options: ["dog", "cat", "horse", "rabbit"],
      hint: getLocalizedText(
        "Man's best friend",
        "Menneskets beste venn"
      ),
      difficulty: "easy",
      points: 10,
      explanation: getLocalizedText(
        "The dog sign typically mimics patting your leg to call a dog.",
        "Tegnet for 'hund' etterligner typisk klapping på beinet for å kalle på en hund."
      )
    },
    {
      id: 7,
      category: "animals",
      text: getLocalizedText(
        "Which animal is being signed?",
        "Hvilket dyr blir tegnet?"
      ),
      imageUrl: "https://images.unsplash.com/photo-1550684376-efcbd6e3f034?w=400",
      correctAnswer: "cat",
      options: ["mouse", "cat", "rat", "bird"],
      hint: getLocalizedText(
        "A common household pet that purrs",
        "Et vanlig kjæledyr som maler"
      ),
      difficulty: "easy",
      points: 10,
      explanation: getLocalizedText(
        "The cat sign mimics whiskers on the sides of the face.",
        "Tegnet for 'katt' etterligner værhår på sidene av ansiktet."
      )
    },
    {
      id: 8,
      category: "animals",
      text: getLocalizedText(
        "What animal is this sign for?",
        "Hvilket dyr er dette tegnet for?"
      ),
      imageUrl: "https://images.unsplash.com/photo-1550684376-efcbd6e3f035?w=400",
      correctAnswer: "elephant",
      options: ["giraffe", "hippo", "rhino", "elephant"],
      hint: getLocalizedText(
        "Has a long trunk",
        "Har en lang snabel"
      ),
      difficulty: "medium",
      points: 15,
      explanation: getLocalizedText(
        "The elephant sign mimics the trunk with an arm extending from the nose.",
        "Tegnet for 'elefant' etterligner snabelen med en arm som strekker seg fra nesen."
      )
    }
  ]
};