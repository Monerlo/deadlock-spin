import { memo } from 'react';
import type { Hero, Priority } from '../types';

interface HeroCardProps {
  hero: Hero;
  isSelected: boolean;
  onClick: (hero: Hero) => void;
  priority?: Priority | null;
  className?: string;
}

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 drop-shadow-sm">
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

const HeroCardComponent = ({ hero, isSelected, onClick, priority = null, className = '' }: HeroCardProps) => {
  let borderClass = 'border-transparent';
  
  if (priority) {
    switch (priority) {
      case 3: borderClass = 'border-[#8A2BE2]'; break; 
      case 2: borderClass = 'border-yellow-400'; break; 
      case 1: borderClass = 'border-[#808080]'; break; 
    }
  } else if (isSelected) {
    borderClass = 'border-[#4a3e30]'; 
  }

  
  const baseClasses = 'bg-[#3d2b24] transition-all duration-200 rounded-xl';
  
  
  const statusClasses = isSelected || priority
  ? 'opacity-100 z-10' 
  : 'opacity-50 hover:opacity-100 hover:scale-105 hover:z-10 transform'; 

  const imageUrl = hero.images.icon_hero_card || 'https://assets.deadlock-api.com/images/heroes/heroes_default_vertical.png';

  return (
    <div
      onClick={() => onClick(hero)}
      className={`relative ${baseClasses} border-2 ${borderClass} ${statusClasses} cursor-pointer w-full aspect-[3/4] flex items-center justify-center overflow-hidden ${className}`}
      title={hero.name}
    >
      <img
        src={imageUrl}
        alt={hero.name}
        loading="lazy"
        className="w-full h-full object-cover rounded-lg" 
        onError={(e) => {
           e.currentTarget.src = 'https://assets.deadlock-api.com/images/heroes/heroes_default_vertical.png';
           e.currentTarget.onerror = null;
        }}
      />
      
      {priority && (
        <div className="absolute bottom-1 left-1 flex flex-col gap-[-4px] bg-black/80 p-1 rounded-md pointer-events-none z-10">
          {priority === 3 && <ChevronIcon />}
          {priority >= 2 && <ChevronIcon />}
        </div>
      )}
    </div>
  );
}

export const HeroCard = memo(HeroCardComponent);