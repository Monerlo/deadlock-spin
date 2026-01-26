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
  transition: 'transform 7s cubic-bezier(0.1, 0.9, 0.1, 1)', 
});
      }
    }, 50); 

    return () => clearTimeout(timer);
  }, [winner, pool]);

  return (
    
    <div ref={containerRef} className="relative w-24 h-32 sm:w-28 sm:h-40 bg-[#121212] border-2 border-transparent overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-[#C09B54] z-20"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#C09B54]/10 z-10"></div>
      
      <div
        className="h-full flex items-center absolute top-0 left-0 gap-2"
        style={style}
        onTransitionEnd={onSpinEnd} 
      >
        {reelItems.map((hero, index) => (
          <div
            key={`${hero.id}-${index}`}
            
            className="flex-shrink-0 w-24 aspect-[3/4] p-1"
            style={{ boxSizing: 'border-box' }}
          >
            <img
  src={hero.images.icon_hero_card || undefined}
  alt={hero.name}
  className="w-full h-full object-cover opacity-100 rounded-md"
/>
          </div>
        ))}
      </div>
    </div>
  );
}