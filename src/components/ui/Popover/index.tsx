import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { cn } from '../../../utils/cn';

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  side = 'bottom',
  align = 'center',
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const handleTriggerClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTriggerRect(rect);
    setIsOpen(!isOpen);
  };

  const getPopoverPosition = () => {
    if (!triggerRect) return {};

    const positions = {
      top: { top: triggerRect.top - 8, left: triggerRect.left },
      right: { top: triggerRect.top, left: triggerRect.right + 8 },
      bottom: { top: triggerRect.bottom + 8, left: triggerRect.left },
      left: { top: triggerRect.top, left: triggerRect.left - 8 }
    };

    return positions[side];
  };

  return (
    <>
      <div onClick={handleTriggerClick}>{trigger}</div>
      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              style={getPopoverPosition()}
              className={cn(
                'fixed z-50 min-w-[200px] rounded-lg p-4',
                'bg-white shadow-lg dark:bg-gray-800',
                className
              )}
            >
              {content}
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};