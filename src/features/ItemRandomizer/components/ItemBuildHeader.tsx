import React from 'react';

interface ItemBuildHeaderProps {
  totalSouls: number;
  allRevealed: boolean;
  onRevealAll: () => void;
  onGenerate: () => void;
}

const SOULS_ICON_URL = "/Souls.webp";

export const ItemBuildHeader: React.FC<ItemBuildHeaderProps> = ({ 
  totalSouls, allRevealed, onRevealAll, onGenerate 
}) => {
  return (
    <div className="bg-[#121212] border-b border-[#3d2b24] p-3 md:p-4 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 relative overflow-hidden rounded-t-xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E19D37]/30 to-transparent"></div>

      <div className="flex flex-col items-center md:items-start z-10">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white leading-none">
          Current <span className="text-[#E19D37]">Build</span>
        </h2>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border transition-colors duration-500
             ${!allRevealed 
                ? 'border-[#3d2b24] text-[#808080] bg-[#1A1A1A] animate-pulse' 
                : 'border-[#E19D37] text-[#E19D37] bg-[#E19D37]/10'
             }
          `}>
             {!allRevealed ? "ANALYZING DATA..." : "BALANCED BUILD"}
          </span>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row items-center gap-3 z-10 w-full md:w-auto">
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-md border border-[#3d2b24]">
           <div className="flex flex-col items-end leading-none">
             <span className="text-[9px] text-[#808080] uppercase tracking-wider font-bold">Total Net Worth</span>
             <span className="text-lg font-bold text-[#E19D37] font-mono tracking-tighter">
                {allRevealed ? totalSouls.toLocaleString() : "???"}
             </span>
           </div>
           <img src={SOULS_ICON_URL} alt="Souls" className="w-6 h-6 object-contain drop-shadow-md opacity-90" />
        </div>

        <div className="flex gap-2">
           {!allRevealed && (
              <button onClick={onRevealAll} className="h-8 px-4 bg-[#1A1A1A] border border-[#3d2b24] hover:border-[#E19D37] hover:text-[#E19D37] text-[#A0A0A0] text-[10px] font-bold uppercase tracking-wider rounded transition-all">
                Reveal
              </button>
           )}
           <button 
              onClick={onGenerate}
              className="h-8 px-5 text-[10px] font-bold uppercase tracking-widest rounded transition-all shadow-lg flex items-center bg-[#E19D37] text-black border border-[#E19D37] hover:bg-[#c98a2d]"
            >
              Generate
           </button>
        </div>
      </div>
    </div>
  );
};