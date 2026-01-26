import { useRef } from 'react';
import type { Hero } from '../types'; 
import { useSpinAnimation } from '../hooks/useSpinAnimation';

interface SpinningReelProps {
  reelItems: Hero[];
  winner: Hero | null;
  onSpinEnd: () => void;
}

export function SpinningReel({ reelItems, winner, onSpinEnd }: SpinningReelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  
  const { style, isFinished, handleTransitionEnd, WINNER_POSITION } = useSpinAnimation(
    containerRef, 
    winner, 
    onSpinEnd
  );

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-40 bg-[#1a110e] border-y border-[#3d2b24] overflow-hidden"
    >
      
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-[#C09B54] z-20 shadow-[0_0_8px_rgba(192,155,84,0.6)] transition-opacity duration-500 ${isFinished ? 'opacity-0' : 'opacity-100'}`}></div>
      
   
      <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-[#1a110e] to-transparent"></div>
      <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-[#1a110e] to-transparent"></div>

      <div
        className="h-full flex items-center absolute top-0 left-0 gap-2"
        style={{
          ...style,
          willChange: 'transform', 
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {reelItems.map((hero, index) => {
          if (!hero) return null;

          const isWinnerCard = index === WINNER_POSITION;
          const showWinnerEffect = isFinished && isWinnerCard;

          return (
            <div
              key={`${hero.id}-${index}`} 
              className={`flex-shrink-0 w-24 aspect-[3/4] p-1 transition-all duration-500 ${
                showWinnerEffect 
                  ? 'scale-110 z-30 brightness-110' 
                  : 'scale-100 z-0 opacity-100'
              }`}
            >
              <div className={`w-full h-full relative rounded-lg border ${
                  showWinnerEffect ? 'border-[#C09B54] shadow-lg' : 'border-white/5'
                }`}>
                  <img
                    src={hero.images.icon_hero_card || undefined}
                    alt={hero.name}
                    className={`w-full h-full object-cover rounded-lg ${
                      isFinished && !isWinnerCard ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'
                    }`}
                  />
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}