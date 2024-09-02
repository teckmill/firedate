import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { User } from '../types';
import { useTheme } from '@mui/material/styles';

interface SwipeCardProps {
  user: User;
  onSwipe: (liked: boolean) => void;
  onReport: (userId: string) => void;
  variant: 'A' | 'B';
}

const SwipeCard: React.FC<SwipeCardProps> = ({ user, onSwipe, onReport, variant }) => {
  const theme = useTheme();
  const cardStyle = variant === 'A' ? styles.cardA : styles.cardB;

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe(true);
    } else if (info.offset.x < -100) {
      onSwipe(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      onSwipe(false);
    } else if (event.key === 'ArrowRight') {
      onSwipe(true);
    }
  };

  return (
    <motion.div 
      className={`swipe-card ${cardStyle}`}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDrag}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Profile of ${user.name}`}
      role="button"
    >
      <img src={user.photos[0]} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
      <div className="swipe-buttons">
        <motion.button 
          onClick={() => onSwipe(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Pass"
        >
          Pass
        </motion.button>
        <motion.button 
          onClick={() => onSwipe(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Like"
        >
          Like
        </motion.button>
      </div>
      <motion.button 
        onClick={() => onReport(user.id)} 
        className="report-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Report ${user.name}`}
      >
        Report
      </motion.button>
    </motion.div>
  );
};

const styles = {
  cardA: 'card-layout-a',
  cardB: 'card-layout-b'
};

export default SwipeCard;