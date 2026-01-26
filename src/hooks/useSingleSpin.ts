import { useState, useEffect } from 'react';
import type { Hero } from '../types';

const REEL_LENGTH = 100;
const WINNER_POSITION = 90;

export function useSingleSpin(initialPool: Hero[]) {
  const [winner, setWinner] = useState<Hero | null>(null);
  const [isSpinning, setIsSpinning] = useState(false); 
  const [reelItems, setReelItems] = useState<Hero[]>([]);

  
  useEffect(() => {
    if (initialPool.length > 0 && reelItems.length === 0) {
       const initialReel = [...Array(REEL_LENGTH)].map(() => initialPool[Math.floor(Math.random() * initialPool.length)]);
       setReelItems(initialReel);
    }
  }, [initialPool, reelItems.length]);

 const spin = (currentPool: Hero[]) => {
  if (currentPool.length < 2 || isSpinning) return;
  
  setIsSpinning(true); 
  setWinner(null);

    const newWinner = currentPool[Math.floor(Math.random() * currentPool.length)];
    
    const newReel = [...Array(REEL_LENGTH)].map((_, i) => {
      if (i === WINNER_POSITION) return newWinner;
      return currentPool[Math.floor(Math.random() * currentPool.length)];
    });
    
    
    setTimeout(() => {
        setReelItems(newReel);
        setWinner(newWinner);
    }, 50);
  };

  const handleSpinEnd = () => {
    setIsSpinning(false);
  };

  const resetWinner = () => {
      setWinner(null);
  }

  return {
    winner,
    isSpinning,
    reelItems,
    spin,
    handleSpinEnd,
    resetWinner
  };
}