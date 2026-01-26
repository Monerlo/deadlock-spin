import { useState, useEffect } from 'react';
import type { Item } from '../types';
import { fetchItems, SOULS_ICON_URL } from '../services/deadlockApi';


const CATEGORY_STYLES: Record<string, any> = {
  weapon: {
    bg: '#80550F',
    header: '#C97A03',
    gradient: 'linear-gradient(to bottom, #987556, #e8be86)',
    accent: '#C97A03',
  },
  vitality: {
    bg: '#3D5918',
    header: '#659818',
    gradient: 'linear-gradient(to bottom, #659818, #8DBF3C)',
    accent: '#659818',
  },
  spirit: {
    bg: '#4B2C5E',
    header: '#8953B7',
    gradient: 'linear-gradient(to bottom, #8953B7, #B57EDC)',
    accent: '#8953B7',
  },
  default: {
    bg: '#2A2A2A',
    header: '#404040',
    gradient: 'linear-gradient(to bottom, #404040, #606060)',
    accent: '#404040',
  }
};

const ItemDeck = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      const data = await fetchItems();
      const shuffled = data.sort(() => 0.5 - Math.random());
      setItems(shuffled);
    };
    loadItems();
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const interval = setInterval(() => {
      
      setIsFlipped(true);

      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        
        
        requestAnimationFrame(() => {
             setIsFlipped(false);
        });
      }, 500); 

    }, 3000);

    return () => clearInterval(interval);
  }, [items]);

  if (items.length === 0) return <div className="text-white font-mono text-sm animate-pulse">Loading...</div>;

  const item = items[currentIndex];
  const categoryKey = item.item_slot_type || 'default';
  const style = CATEGORY_STYLES[categoryKey] || CATEGORY_STYLES.default;
  
  return (
    <div className="relative w-52 h-72 perspective-deck flex items-center justify-center">
        <div
          className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.45,0,0.55,1)]"
          style={{
            backgroundColor: style.bg,
            border: `2px solid ${style.accent}`,
            
            transform: isFlipped ? 'rotateY(90deg)' : 'rotateY(0deg)',
            willChange: 'transform', 
          }}
        >
          
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.5) 1px, transparent 1px)', backgroundSize: '6px 6px' }}
          />

          
          <div 
            className="relative px-3 py-2 flex items-center justify-center z-10 shadow-md transition-colors duration-300"
            style={{ backgroundColor: style.header }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider truncate text-[#FFEFD7] drop-shadow-sm text-center">
              {item.name}
            </h3>
          </div>

          
          <div className="relative flex flex-col items-center justify-center h-full pb-8 z-10">
             
             <div className="relative mb-3">
               <div 
                  className="absolute inset-0 blur-lg opacity-30 rounded-full scale-110 transition-colors duration-300"
                  style={{ background: style.gradient }}
               />
               <img 
                 src={item.shop_image_webp || item.image_webp || ''} 
                 alt={item.name} 
                 className="relative w-20 h-20 object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
               />
             </div>

             
             <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1 rounded-full border border-white/10 shadow-lg backdrop-blur-sm">
               <img src={SOULS_ICON_URL} alt="Souls" className="w-4 h-4" />
               <span className="font-bold font-mono text-[#98FFDE]">
                 {item.cost || '0'}
               </span>
             </div>
          </div>
        </div>
    </div>
  );
};

export default ItemDeck;