import React, { useEffect, useState, useRef } from 'react';
import type { Hero } from '../types'; 

interface HeroSpinnerProps {
  pool: Hero[];
  winner: Hero;
  onSpinEnd: () => void;
}

const REEL_LENGTH = 100;
const WINNER_POSITION = 90; 
const CARD_WIDTH = 96; 
const GAP_WIDTH = 8;   


export function HeroSpinner({ pool, winner, onSpinEnd }: HeroSpinnerProps) {
  const [reelItems, setReelItems] = useState<Hero[]>([]);
  const [style, setStyle] = useState<React.CSSProperties>({ transform: 'translateX(0px)' });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!winner || pool.length === 0) return;

    // Create a strip of heroes for the animation
    const newReel = [...Array(REEL_LENGTH)].map((_, i) => {
        if (i === WINNER_POSITION) return winner;
        return pool[Math.floor(Math.random() * pool.length)];
    });
    setReelItems(newReel);
    
  
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const totalCardSpace = CARD_WIDTH + GAP_WIDTH;
        const winnerOffset = WINNER_POSITION * totalCardSpace;
        
        
        const finalPositionPx = (containerWidth / 2) - (CARD_WIDTH / 2) - winnerOffset;

        setStyle({
          transform: `translateX(${finalPositionPx}px)`,
          transition: 'transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        });
      }
    }, 50); 

    return () => clearTimeout(timer);
  }, [winner, pool]);

  return (
    
    <div ref={containerRef} className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#121212] border-2 border-transparent overflow-hidden">
      {/* Central pointer line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-[#C09B54] z-20"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-full sm:w-28 bg-[#C09B54]/10 z-10"></div>
      
      <div
        className="h-full flex items-center absolute top-0 left-0 gap-2"
        style={style}
        onTransitionEnd={onSpinEnd} 
      >
        {reelItems.map((hero, index) => (
          <div
            key={`${hero.id}-${index}`}
            className="flex-shrink-0 w-24 h-24 p-2"
            style={{ boxSizing: 'border-box' }}
          >
            <img
              src={hero.images.icon_hero_card}
              alt={hero.name}
              className="w-full h-full object-contain opacity-60"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
