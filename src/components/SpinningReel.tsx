import { useEffect, useState, useRef } from 'react';
import type { Hero } from '../services/deadlockApi';

interface SpinningReelProps {
  reelItems: Hero[];
  winner: Hero | null;
  onSpinEnd: () => void;
}


const WINNER_POSITION = 90; 
const CARD_WIDTH = 96;
const GAP_WIDTH = 8;

export function SpinningReel({ reelItems, winner, onSpinEnd }: SpinningReelProps) {
  const [style, setStyle] = useState<React.CSSProperties>({ transform: 'translateX(0px)' });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (winner && containerRef.current) {
      
      setStyle({
        transition: 'none',
        transform: 'translateX(0px)',
      });

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
    } else {
      setStyle({
        transition: 'none',
        transform: 'translateX(0px)',
      });
    }
  }, [winner, reelItems]);

  return (
    <div ref={containerRef} className="relative w-full h-24 bg-[#121212] border-y border-[#2D2D2D] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-[#C09B54] z-20"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-full bg-[#C09B54]/20 z-10"></div>
      
      <div
        className="h-full flex items-center absolute top-0 left-0 gap-2"
        style={style}
        onTransitionEnd={winner ? onSpinEnd : undefined}
      >
        {reelItems.map((hero, index) => (
          <div
            key={hero ? `${hero.id}-${index}` : index}
            className="flex-shrink-0 w-24 h-24 p-2"
            style={{ boxSizing: 'border-box' }}
          >
            {hero && (
              <img
                src={hero.images.icon_hero_card}
                alt={hero.name}
                className="w-full h-full object-contain opacity-60"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

