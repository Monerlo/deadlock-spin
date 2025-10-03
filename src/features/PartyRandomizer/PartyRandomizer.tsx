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

  return (
    <>
      <div className="bg-[#121212] border border-[#2D2D2D] p-4 md-p-6 mb-6">
        {/* === Блок налаштувань === */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            <button
            onClick={() => setIsPriorityMode(!isPriorityMode)}
            disabled={isGenerating}
            className={`font-bold py-2 px-6 border-2 transition-colors ${
                isPriorityMode 
                ? 'bg-[#C09B54] text-black border-[#C09B54]' 
                : 'bg-transparent text-[#A0A0A0] border-[#2D2D2D] hover:bg-[#2D2D2D]'
            } disabled:opacity-50`}
            >
            {isPriorityMode ? 'Priority Mode: ON' : 'Priority Mode: OFF'}
            </button>
             <button
            onClick={() => setIsAnimationEnabled(!isAnimationEnabled)}
            disabled={isGenerating}
            className={`font-bold py-2 px-6 border-2 transition-colors ${
                isAnimationEnabled 
                ? 'bg-[#C09B54] text-black border-[#C09B54]' 
                : 'bg-transparent text-[#A0A0A0] border-[#2D2D2D] hover:bg-[#2D2D2D]'
            } disabled:opacity-50`}
            >
            {isAnimationEnabled ? 'Animation: ON' : 'Animation: OFF'}
            </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
            <CustomNumberInput 
            label="Number of Players:" value={numPlayers} onChange={setNumPlayers}
            min={1} max={maxPlayers} disabled={isGenerating}
            />
            <CustomNumberInput 
            label="Heroes per Player:" value={heroesPerPlayer} onChange={setHeroesPerPlayer}
            min={1} max={maxHeroesPerPlayer} disabled={isGenerating}
            />
        </div>

        {/* === Блок керування === */}
        <div className="flex items-center justify-center gap-4">
            <button
            onClick={generateTeams}
            disabled={pool.length === 0 || isGenerating}
            className="bg-[#C09B54] hover:opacity-90 disabled:bg-[#2D2D2D] disabled:cursor-not-allowed text-black font-bold py-3 px-8 transition-all text-lg"
            >
            {isGenerating ? 'Generating...' : 'Generate Teams'}
            </button>
            {finalResults.length > 0 && !isGenerating && (
            <button onClick={clearState}
                className="bg-[#121212] border border-[#2D2D2D] hover:bg-[#2D2D2D] text-[#EAEAEA] font-bold py-3 px-8 transition-colors"
            >
                Clear
            </button>
            )}
        </div>

        {error && <p className="text-center text-red-500 font-bold mt-4">{error}</p>}
        
        {/* === Блок результатів === */}
        {finalResults.length > 0 && (
            <div className="mt-8 space-y-6">
            {finalResults.map((playerResult, playerIndex) => (
                <div key={playerResult.playerNumber} className="border-t border-[#2D2D2D] pt-4">
                     <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-bold text-[#C09B54]">Player {playerResult.playerNumber}</h4>
                        {!isGenerating && (
                           <button
                                onClick={() => addHeroToPlayer(playerResult.playerNumber)}
                                disabled={playerResult.heroes.length >= pool.length}
                                className="bg-[#1A1A1A] border border-[#2D2D2D] hover:bg-[#2D2D2D] disabled:opacity-50 disabled:cursor-not-allowed text-sm text-[#A0A0A0] font-semibold py-1 px-3"
                                title={playerResult.heroes.length < pool.length ? "Add a random unique hero" : "No more unique heroes available"}
                            >
                                + Add Hero
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap items-start gap-3">
                    {Array.from({ length: playerResult.heroes.length }).map((_, heroIndex) => {
                        const key = `p${playerIndex}-h${heroIndex}`;
                        if (revealedSlots.has(key) || !isGenerating) {
                            const { hero, priority } = playerResult.heroes[heroIndex];
                            return <HeroCard key={key} hero={hero} isSelected={true} onClick={() => {}} priority={priority} />;
                        }
                        return <HeroPlaceholder key={key} />;
                    })}
                    </div>
                </div>
                ))}
            </div>
        )}
      </div>

      {/* === Модальні вікна === */}
      {isHeroSpinModalVisible && currentSpinData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="w-full max-w-7xl mx-auto bg-[#121212] border-2 border-[#C09B54] shadow-2xl p-6">
                <h3 className="text-center text-2xl font-bold text-[#C09B54] mb-4">ROLLING...</h3>
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

