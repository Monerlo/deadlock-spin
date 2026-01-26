import { useState } from 'react';
import type { Hero } from '../../types';
import { HeroCard } from '../../components/HeroCard';
import { SpinningReel } from '../../components/SpinningReel';
import { AnimationControls } from '../../components/ui/AnimationControls';
import { CustomNumberInput } from '../../components/ui/CustomNumberInput';
import { HeroPlaceholder } from '../../components/ui/HeroPlaceholder';
import { PrioritySpinModal } from './components/PrioritySpinModal';
import { usePartyGenerator } from '../../hooks/usePartyGenerator';

interface PartyRandomizerProps {
  pool: Hero[];
}

export function PartyRandomizer({ pool }: PartyRandomizerProps) {
  const [numPlayers, setNumPlayers] = useState(2);
  const [heroesPerPlayer, setHeroesPerPlayer] = useState(1);
  const [isPriorityMode, setIsPriorityMode] = useState(false);
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);

  const { state, actions } = usePartyGenerator({
    pool,
    numPlayers,
    heroesPerPlayer,
    isPriorityMode,
    isAnimationEnabled,
  });

  const {
    error,
    isGenerating,
    finalResults,
    revealedSlots,
    isHeroSpinModalVisible,
    currentSpinData,
    prioritySpinData,
  } = state;

  const {
    clearState,
    generateTeams,
    handleSkipToEnd,
    handleSkipCurrent,
    addHeroToPlayer,
    handleSpinEnd,
    handlePriorityAnimationEnd
  } = actions;
  
  const maxPlayers = 12;
  const maxHeroesPerPlayer = pool.length > 0 ? pool.length : 1;

  const cardWrapperClass = "w-12 sm:w-16 aspect-[3/4] flex-shrink-0";

  return (
    <>
     
      <div className="bg-[#1a110e] border border-[#3d2b24] rounded-2xl p-4 md:p-6 mb-6 shadow-2xl relative overflow-hidden">
        
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E19D37]/50 to-transparent opacity-50"></div>

        
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            <button
            onClick={() => setIsPriorityMode(!isPriorityMode)}
            disabled={isGenerating}
            
            className={`font-bold py-2 px-6 border rounded-lg transition-all uppercase tracking-wider text-xs ${
                isPriorityMode 
                ? 'bg-[#E19D37] text-black border-[#E19D37] shadow-lg' 
                : 'bg-black/20 text-[#A0A0A0] border-[#3d2b24] hover:border-[#E19D37] hover:text-white'
            } disabled:opacity-50`}
            >
            {isPriorityMode ? 'Priority: ON' : 'Priority: OFF'}
            </button>
             <button
            onClick={() => setIsAnimationEnabled(!isAnimationEnabled)}
            disabled={isGenerating}
            className={`font-bold py-2 px-6 border rounded-lg transition-all uppercase tracking-wider text-xs ${
                isAnimationEnabled 
                ? 'bg-[#E19D37] text-black border-[#E19D37] shadow-lg' 
                : 'bg-black/20 text-[#A0A0A0] border-[#3d2b24] hover:border-[#E19D37] hover:text-white'
            } disabled:opacity-50`}
            >
            {isAnimationEnabled ? 'Anim: ON' : 'Anim: OFF'}
            </button>
        </div>

        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8 p-4 bg-black/20 rounded-xl border border-[#3d2b24]/50">
            <CustomNumberInput 
            label="Players:" value={numPlayers} onChange={setNumPlayers}
            min={1} max={maxPlayers} disabled={isGenerating}
            />
            <CustomNumberInput 
            label="Heroes:" value={heroesPerPlayer} onChange={setHeroesPerPlayer}
            min={1} max={maxHeroesPerPlayer} disabled={isGenerating}
            />
        </div>

        
        <div className="flex items-center justify-center gap-4 mb-6">
            <button
            onClick={generateTeams}
            disabled={pool.length === 0 || isGenerating}
            
            className="px-8 py-3 bg-[#E19D37] hover:bg-[#c98a2d] disabled:bg-[#2D2D2D] disabled:opacity-50 text-black font-bold rounded-lg transition-all shadow-[0_4px_0_0_#8e6120] active:translate-y-[2px] active:shadow-none uppercase tracking-widest text-lg"
            >
            {isGenerating ? 'Spinning...' : 'Spin Party!'}
            </button>

            {finalResults.length > 0 && !isGenerating && (
            <button onClick={clearState}
                className="bg-transparent border border-[#3d2b24] hover:border-[#E19D37] hover:text-[#E19D37] text-[#A0A0A0] font-bold py-3 px-8 rounded-lg transition-colors uppercase tracking-wider text-sm"
            >
                Clear
            </button>
            )}
        </div>

        {error && <p className="text-center text-red-500 font-bold mt-4">{error}</p>}
        
        
        {finalResults.length > 0 && (
            <div className="mt-8 space-y-6">
            {finalResults.map((playerResult, playerIndex) => (
                
                <div key={playerResult.playerNumber} className="border-t border-[#3d2b24] pt-4">
                     <div className="flex justify-between items-center mb-3">
                        
                        <h4 className="text-lg font-bold text-[#E19D37] uppercase tracking-wide">Player {playerResult.playerNumber}</h4>
                        {!isGenerating && (
                           <button
                                onClick={() => addHeroToPlayer(playerResult.playerNumber)}
                                disabled={playerResult.heroes.length >= pool.length}
                                className="bg-[#1A1A1A] border border-[#3d2b24] hover:bg-[#3d2b24] disabled:opacity-50 disabled:cursor-not-allowed text-[10px] text-[#A0A0A0] hover:text-white uppercase font-bold py-1 px-3 rounded"
                                title={playerResult.heroes.length < pool.length ? "Add a random unique hero" : "No more unique heroes available"}
                            >
                                + Add Hero
                            </button>
                        )}
                    </div>
                    
                    <div className="flex flex-wrap items-start gap-4">
                    {Array.from({ length: playerResult.heroes.length }).map((_, heroIndex) => {
                        const key = `p${playerIndex}-h${heroIndex}`;
                        
                        if (revealedSlots.has(key) || !isGenerating) {
                            const { hero, priority } = playerResult.heroes[heroIndex];
                            return (
                                <div key={key} className={cardWrapperClass}>
                                    <HeroCard 
                                        hero={hero} 
                                        isSelected={true} 
                                        onClick={() => {}} 
                                        priority={priority} 
                                    />
                                </div>
                            );
                        }
                        return (
                            <div key={key} className={cardWrapperClass}>
                                <HeroPlaceholder />
                            </div>
                        );
                    })}
                    </div>
                </div>
                ))}
            </div>
        )}
      </div>

      
      {isHeroSpinModalVisible && currentSpinData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            
            <div className="w-full max-w-7xl mx-auto bg-[#1a110e] border-2 border-[#E19D37] shadow-[0_0_50px_rgba(225,157,55,0.2)] p-6 rounded-xl">
                <h3 className="text-center text-2xl font-bold text-[#E19D37] mb-4 tracking-widest uppercase">ROLLING...</h3>
                <SpinningReel 
                    reelItems={currentSpinData.reel} 
                    winner={currentSpinData.winner} 
                    onSpinEnd={handleSpinEnd} 
                />
                 <AnimationControls onSkipCurrent={handleSkipCurrent} onSkipAll={handleSkipToEnd} onCancel={clearState} />
            </div>
        </div>
      )}

      {prioritySpinData && (
          <PrioritySpinModal 
              hero={prioritySpinData.hero}
              finalPriority={prioritySpinData.priority}
              onAnimationEnd={handlePriorityAnimationEnd}
              onSkipCurrent={handleSkipCurrent}
              onSkipAll={handleSkipToEnd}
              onCancel={clearState}
          />
      )}
    </>
  );
}