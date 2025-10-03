import React, { useEffect, useState, useRef } from 'react';
import type { Hero } from '../services/deadlockApi';

interface HeroSpinnerProps {
  pool: Hero[];
  winner: Hero;
  onSpinEnd: () => void;
}

const REEL_LENGTH = 100;
const WINNER_POSITION = 90; 
const CARD_WIDTH = 96; // Відповідає w-24 в Tailwind
const GAP_WIDTH = 8;   // Відповідає gap-2 в Tailwind

/**
 * Компонент для анімації обертання одного героя.
 * Він приймає переможця, запускає анімацію і викликає onSpinEnd по її завершенню.
 */
export function HeroSpinner({ pool, winner, onSpinEnd }: HeroSpinnerProps) {
  const [reelItems, setReelItems] = useState<Hero[]>([]);
  const [style, setStyle] = useState<React.CSSProperties>({ transform: 'translateX(0px)' });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!winner || pool.length === 0) return;

    // Створюємо стрічку героїв для анімації
    const newReel = [...Array(REEL_LENGTH)].map((_, i) => {
        if (i === WINNER_POSITION) return winner;
        return pool[Math.floor(Math.random() * pool.length)];
    });
    setReelItems(newReel);
    
    // Запускаємо анімацію після монтування компонента
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const totalCardSpace = CARD_WIDTH + GAP_WIDTH;
        const winnerOffset = WINNER_POSITION * totalCardSpace;
        
        // Центруємо картку переможця
        const finalPositionPx = (containerWidth / 2) - (CARD_WIDTH / 2) - winnerOffset;

        setStyle({
          transform: `translateX(${finalPositionPx}px)`,
          transition: 'transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        });
      }
    }, 50); // Невелика затримка для стабільного рендеру

    return () => clearTimeout(timer);
  }, [winner, pool]);

  return (
    // Контейнер має ті ж розміри, що й HeroCard
    <div ref={containerRef} className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#121212] border-2 border-transparent overflow-hidden">
      {/* Центральна лінія-вказівник */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-[#C09B54] z-20"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-full sm:w-28 bg-[#C09B54]/10 z-10"></div>
      
      <div
        className="h-full flex items-center absolute top-0 left-0 gap-2"
        style={style}
        onTransitionEnd={onSpinEnd} // Викликаємо колбек по завершенню CSS-анімації
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

