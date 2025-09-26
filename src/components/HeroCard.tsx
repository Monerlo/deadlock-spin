import { memo } from 'react';
import type { Hero } from '../services/deadlockApi';

interface HeroCardProps {
  hero: Hero;
  isSelected: boolean;
  onClick: (hero: Hero) => void;
}

const HeroCardComponent = ({ hero, isSelected, onClick }: HeroCardProps) => {
  const selectionClasses = isSelected
    ? 'border-[#C09B54] scale-105'
    : 'border-transparent';

  return (
    <div
      onClick={() => onClick(hero)}
      className={`
        bg-[#121212] border ${selectionClasses}
        cursor-pointer transform transition-all duration-200 hover:border-[#C09B54]/50
        w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center overflow-hidden
      `}
      title={hero.name}
    >
      <img
        src={hero.images.icon_hero_card}
        alt={hero.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

export const HeroCard = memo(HeroCardComponent);
