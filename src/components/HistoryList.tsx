import type { Hero } from '../types';

interface HistoryListProps {
  history: Hero[];
  onClear: () => void;
}

export const HistoryList = ({ history, onClear }: HistoryListProps) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 border-t border-[#2D2D2D] pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#C09B54] font-bold uppercase tracking-widest text-sm">Recent Spins</h3>
        <button 
          onClick={onClear}
          className="text-[#808080] hover:text-red-400 text-xs transition-colors uppercase font-bold"
        >
          Clear History
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {history.map((hero, index) => (
          <div 
            key={`${hero.id}-${index}`} 
            className="group relative w-12 h-16 sm:w-14 sm:h-20 bg-[#1A1A1A] border border-[#3d2b24] rounded-md overflow-hidden hover:border-[#C09B54] transition-all"
            title={hero.name}
          >
            <img 
              src={hero.images.icon_hero_card || ''} 
              alt={hero.name} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
};