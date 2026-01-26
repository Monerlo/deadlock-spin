import React from 'react';
import type { ClassifiedItem } from '../services/itemUtils';
import { CATEGORY_COLORS, getItemBackground, getRomanTier } from '../services/itemUtils';

interface RandomCardProps {
  data: ClassifiedItem;
  onReveal: () => void;
}

export const RandomCard: React.FC<RandomCardProps> = ({ data, onReveal }) => {
  const { item, category, isActive, isRevealed } = data;
  const tier = item.item_tier || 1;
  const triangleColor = CATEGORY_COLORS[category];

 
  const iconUrl = item.shop_image_webp || item.image_webp;

  return (
    <div 
      className="relative w-[71px] h-[106.5px] rounded-[3px] overflow-hidden select-none shadow-[0_5px_15px_rgba(0,0,0,0.5)] bg-[#222] font-['Roboto',sans-serif] cursor-pointer group"
      onClick={onReveal}
    >
      
      
      <div className="absolute inset-0 w-full h-full">
        {/* 1. ФОН */}
        <img 
          src={getItemBackground(category, tier)} 
          alt="Background" 
          className="absolute top-0 left-0 w-full h-full z-10"
        />

        
        <div className="relative w-full h-[71px] z-20">
          {iconUrl ? (
             <img 
               src={iconUrl} 
               alt={item.name} 
               className="absolute top-0 left-0 w-full h-full rounded-t-[2.84px] p-[1px] box-border object-cover"
             />
          ) : (
             <div className="w-full h-full bg-black/20 flex items-center justify-center text-[8px]">No Icon</div>
          )}
          
          
          <div className="absolute top-0 right-0 w-[28.4px] h-[28.4px] z-30 drop-shadow-[-2px_0px_3px_black]">
            <div 
              className="w-full h-full" 
              style={{ 
                backgroundColor: triangleColor, 
                clipPath: 'polygon(100% 0, 100% 100%, 0 0)' 
              }} 
            />
            
            <p className="absolute top-[1px] right-[2px] w-[55%] text-center text-[11.36px] text-[#020101] m-0 z-40 leading-none font-bold">
              {getRomanTier(tier)}
            </p>
          </div>
        </div>

        
        {isActive && (
          <div className="absolute top-[62.5px] left-0 w-full flex justify-center z-50">
            <p className="px-[4px] py-[2px] text-[8.52px] leading-[1.25] text-[#d1c6b2] bg-[#020101] rounded-[2.13px] uppercase font-extrabold m-0">
              Active
            </p>
          </div>
        )}

        
        <div className="absolute bottom-0 left-0 w-full h-[35.5px] flex items-center justify-center z-20">
          <p className="w-full text-center text-[11.36px] leading-[1.1] text-[#020101] font-semibold px-[2px] m-0 line-clamp-2 overflow-hidden text-ellipsis display-[-webkit-box] [-webkit-box-orient:vertical]">
            {item.name}
          </p>
        </div>
      </div>

      
      <div 
        className={`
          absolute inset-0 z-[60] flex items-center justify-center 
          bg-[#c5c1b4] /* Базовий світло-сірий/бежевий колір */
          transition-all duration-500 ease-in-out overflow-hidden
          ${isRevealed ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100 scale-100'}
        `}
      >
        
        <img 
            src="https://game.deadlock.coach/vpk/panorama/images/shop/catalog/cards/card_backer_weapon_t1.webp"
            alt="texture"
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-125 contrast-75 opacity-60 mix-blend-multiply"
        />

        
        <span className="relative z-10 text-4xl font-extrabold text-[#020101]/90 drop-shadow-sm">?</span>
      </div>

    </div>
  );
};