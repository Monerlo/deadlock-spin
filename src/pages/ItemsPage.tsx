import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useItemBuild } from '../hooks/useItemBuild';
import { ItemBuildHeader } from '../features/ItemRandomizer/components/ItemBuildHeader';
import { ItemPhaseSection } from '../features/ItemRandomizer/components/ItemPhaseSection';
import { RandomCard } from '../components/RandomCard';
import type { ClassifiedItem } from '../services/itemUtils';

export const ItemsPage: React.FC = () => {
  const { 
    randomBuild, 
    isLoading, 
    totalSouls, 
    allRevealed, 
    generateRandomBuild, 
    handleReveal, 
    revealAll 
  } = useItemBuild();

  
  const displayBuild = useMemo(() => {
    if (!randomBuild) return null;
    const mergeAndSort = (baseItems: ClassifiedItem[], activeItems: ClassifiedItem[], phaseFilter: string) => {
       const relevantActives = activeItems.filter(i => i.phase === phaseFilter);
       return [...baseItems, ...relevantActives].sort((a, b) => (a.item.cost || 0) - (b.item.cost || 0));
    };

    return {
      lane: mergeAndSort(randomBuild.lane, randomBuild.active, 'lane'),
      mid: mergeAndSort(randomBuild.mid, randomBuild.active, 'mid'),
      late: mergeAndSort(randomBuild.late, randomBuild.active, 'late'),
    };
  }, [randomBuild]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] text-[#E19D37] font-mono text-sm">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-[#E19D37] border-t-transparent rounded-full animate-spin"></div>
        <span>ACCESSING THE PATRON...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-2 sm:p-4 font-sans">
      <Helmet>
        <title>Deadlock Build Randomizer & Item Generator</title>
        <meta name="description" content="Generate random Deadlock item builds. Challenge yourself with randomized weapon, vitality, and spirit items for early, mid, and late game." />
        <link rel="canonical" href="https://deadlockrandom.site/items" />
      </Helmet>

      
      <header className="text-center relative py-6 md:py-8 mb-2 w-full max-w-4xl mx-auto border-b border-[#2D2D2D]/50 px-4">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-3 text-white">
          Deadlock <span className="text-[#E19D37]">Item Randomizer</span>
        </h1>
        <p className="max-w-2xl mx-auto text-[#A0A0A0] text-xs md:text-sm leading-relaxed">
          Challenge your adaptability with our Deadlock Shop Randomizer. Generate balanced item builds that test your ability to win with unexpected loadouts. From laning phase economy to late-game luxury pivots, every spin creates a unique strategy.
        </p>
      </header>

      
      <div className="w-full max-w-4xl mx-auto bg-[#1a110e] border border-[#3d2b24] rounded-xl shadow-2xl overflow-hidden relative flex flex-col mb-12">
        
        <ItemBuildHeader 
          totalSouls={totalSouls}
          allRevealed={allRevealed}
          onRevealAll={revealAll}
          onGenerate={generateRandomBuild}
        />

        {displayBuild && (
          <div className="flex-grow bg-[url('/bg-item.jpg')] bg-cover bg-center relative">
             <div className="absolute inset-0 bg-[#1a110e]/95 backdrop-blur-sm"></div>

             <div className="relative z-10 flex flex-col">
                <ItemPhaseSection title="EARLY GAME" subtitle="0 - 10 min">
                  {displayBuild.lane.map((item, idx) => (
                    <RandomCard key={`lane-${item.item.id}-${idx}`} data={item} onReveal={() => handleReveal(item)} />
                  ))}
                </ItemPhaseSection>

                <ItemPhaseSection title="MID GAME" subtitle="10 - 25 min">
                  {displayBuild.mid.map((item, idx) => (
                    <RandomCard key={`mid-${item.item.id}-${idx}`} data={item} onReveal={() => handleReveal(item)} />
                  ))}
                </ItemPhaseSection>

                <ItemPhaseSection title="LATE GAME" subtitle="25+ min">
                  {displayBuild.late.map((item, idx) => (
                    <RandomCard key={`late-${item.item.id}-${idx}`} data={item} onReveal={() => handleReveal(item)} />
                  ))}
                </ItemPhaseSection>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};