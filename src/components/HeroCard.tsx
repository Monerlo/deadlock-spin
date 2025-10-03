import { memo } from 'react';
import type { Hero, Priority } from '../types';

interface HeroCardProps {
  hero: Hero;
  isSelected: boolean;
  onClick: (hero: Hero) => void;
  priority?: Priority | null;
}

const ChevronIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="text-green-400 [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.7))]" 
  >
    <path d="m18 15-6-6-6 6"/>
  </svg>
);


const HeroCardComponent = ({ hero, isSelected, onClick, priority = null }: HeroCardProps) => {
  
  let borderClass = 'border-transparent';
  
  if (priority) {
    switch (priority) {
      case 3: borderClass = 'border-[#8A2BE2]'; break;
      case 2: borderClass = 'border-yellow-400'; break;
      case 1: borderClass = 'border-[#808080]'; break;
    }
  } else if (isSelected) {
    borderClass = 'border-[#C09B54]';
  }

  const baseClasses = 'bg-[#121212] border-2 transform transition-all duration-200';
  const selectionClasses = isSelected ? 'scale-105' : '';
  const hoverClasses = !priority && !isSelected ? 'hover:border-[#C09B54]/50' : '';

  return (
    <div
      onClick={() => onClick(hero)}
      className={`relative ${baseClasses} ${borderClass} ${selectionClasses} ${hoverClasses} cursor-pointer w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center overflow-hidden`}
      title={hero.name}
    >
      <img
        src={hero.images.icon_hero_card}
        alt={hero.name}
        className="w-full h-full object-cover"

        loading="lazy"
      />
      {priority && (
        <div className="absolute bottom-1 left-1 flex flex-col gap-[-4px] bg-black/70 p-1 rounded-md pointer-events-none">
          {priority === 3 && <ChevronIcon />}
          {priority >= 2 && <ChevronIcon />}
        </div>
      )}
    </div>
  );
}

export const HeroCard = memo(HeroCardComponent);

