import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '../hooks/useToast';

interface ShareButtonProps {
  score: number;
  level: number;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ score, level }) => {
  const { addToast } = useToast();

  const handleShare = async () => {
    const text = `🎮 Jeg spiller Ask123 - Tegn til Tale!\n🏆 Poeng: ${score}\n⭐ Nivå: ${level}\nLær tegnspråk på en morsom måte!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ask123 - Tegn til Tale',
          text,
          url: window.location.href
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          addToast('Kunne ikke dele innholdet', 'error');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        addToast('Kopiert til utklippstavlen!', 'success');
      } catch {
        addToast('Kunne ikke kopiere til utklippstavlen', 'error');
      }
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleShare}
      className="group"
    >
      <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="ml-2">Del fremgang</span>
    </Button>
  );
};