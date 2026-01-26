import { useState, useEffect, useRef, useCallback } from 'react';
import type { Hero } from '../types';


const CARD_WIDTH = 96;
const GAP_WIDTH = 8;
const WINNER_POSITION = 90;
const SPIN_DURATION = 5000;

export function useSpinAnimation(
  containerRef: React.RefObject<HTMLDivElement>,
  winner: Hero | null,
  onSpinEnd: () => void
) {
  const [style, setStyle] = useState<React.CSSProperties>({ transform: 'translateX(0px)' });
  const [isFinished, setIsFinished] = useState(false);
  
  
  const isSpinning = useRef(false);
  
  
  const onSpinEndRef = useRef(onSpinEnd);
  useEffect(() => {
    onSpinEndRef.current = onSpinEnd;
  }, [onSpinEnd]);

  
  const calculatePosition = useCallback((targetIndex: number) => {
    if (!containerRef.current) return 0;
    const containerWidth = containerRef.current.offsetWidth;
    const totalCardSpace = CARD_WIDTH + GAP_WIDTH;
    const centerOffset = (containerWidth / 2) - (CARD_WIDTH / 2);
    const cardPosition = targetIndex * totalCardSpace;
    return -(cardPosition - centerOffset);
  }, [containerRef]);

  
  useEffect(() => {
    let startTimer: number;
    let safetyTimer: number;

    if (winner && containerRef.current) {
      setIsFinished(false);
      isSpinning.current = true;

      
      const initialPos = calculatePosition(5);
      setStyle({
        transform: `translateX(${initialPos}px)`,
        transition: 'none',
      });

      
      startTimer = window.setTimeout(() => {
        if (containerRef.current && isSpinning.current) {
          const finalPos = calculatePosition(WINNER_POSITION);
          setStyle({
            transform: `translateX(${finalPos}px)`,
            transition: `transform ${SPIN_DURATION}ms cubic-bezier(0.15, 0.85, 0.35, 1)`,
          });
        }
      }, 50);

      
      safetyTimer = window.setTimeout(() => {
        completeSpin();
      }, SPIN_DURATION + 100);
    }

    
    const completeSpin = () => {
        if (isSpinning.current) {
            isSpinning.current = false;
            setIsFinished(true);
            
            if (onSpinEndRef.current) onSpinEndRef.current();
        }
    };

    
    return () => {
      clearTimeout(startTimer);
      clearTimeout(safetyTimer);
      
      isSpinning.current = false;
    };
  }, [winner, calculatePosition]); 

  // Обробник CSS події
  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === 'transform' && isSpinning.current) {
        
        isSpinning.current = false;
        setIsFinished(true);
        if (onSpinEndRef.current) onSpinEndRef.current();
    }
  };

  return {
    style,
    isFinished,
    handleTransitionEnd,
    WINNER_POSITION 
  };
}