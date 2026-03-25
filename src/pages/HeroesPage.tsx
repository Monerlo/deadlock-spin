import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { HeroCard } from '../components/HeroCard';
import { SpinningReel } from '../components/SpinningReel';
import { HistoryList } from '../components/HistoryList';
import { PartyRandomizer } from '../features/PartyRandomizer/PartyRandomizer';
import { useHeroesPool } from '../hooks/useHeroesPool';
import { useSingleSpin } from '../hooks/useSingleSpin';
import type { Hero } from '../types';

export function HeroesPage() {
  const { allHeroes, poolArray, roulettePool, toggleHero, resetPool, clearPool } = useHeroesPool();
  const { winner, isSpinning, reelItems, spin, handleSpinEnd } = useSingleSpin(allHeroes);
  const [mode, setMode] = useState<'spin' | 'party'>('spin');
  const [showWinnerName, setShowWinnerName] = useState(false);
  const [spinHistory, setSpinHistory] = useState<Hero[]>(() => {
    const saved = localStorage.getItem('deadlock_spin_history');
    return saved ? JSON.parse(saved) : [];
  });

  const handleStartSpin = () => {
    if (isSpinning || poolArray.length < 2) return;
    setShowWinnerName(false);
    spin(poolArray);
  };

  const onSpinFinished = () => {
    handleSpinEnd();
    setShowWinnerName(true);
    if (winner) {
      const newHistory = [winner, ...spinHistory].slice(0, 20);
      setSpinHistory(newHistory);
      localStorage.setItem('deadlock_spin_history', JSON.stringify(newHistory));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col w-full relative z-10 font-sans">
      <Helmet>
        <title>Deadlock Hero Randomizer — Random Character Picker & Wheel</title>
        <meta
          name="description"
          content="Spin the wheel and get a random Deadlock hero instantly. Choose from all heroes, use Party Mode for your squad, or filter your pool. Free & fast."
        />
        <link rel="canonical" href="https://deadlockrandom.site/heroes" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6 w-full">

        <header className="text-center relative py-6 border-b border-[#2D2D2D]/50">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2 text-white">
            Deadlock <span className="text-[#E19D37]">Hero Randomizer</span>
          </h1>
          <p className="max-w-xl mx-auto text-[#A0A0A0] text-xs md:text-sm leading-relaxed">
            Generate random hero picks for your next Deadlock match. Use our <strong>character wheel</strong> algorithm to select from the pool, or try the <strong>Deadlock roulette</strong> for teams.
          </p>
        </header>

        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 bg-black/40 border border-[#3d2b24] rounded-xl">
            <button
              onClick={() => setMode('spin')}
              className={`px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${mode === 'spin' ? 'bg-[#E19D37] text-black shadow-lg' : 'text-[#808080] hover:text-white'}`}
            >
              Single Spin
            </button>
            <button
              onClick={() => setMode('party')}
              className={`px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${mode === 'party' ? 'bg-[#E19D37] text-black shadow-lg' : 'text-[#808080] hover:text-white'}`}
            >
              Party Mode
            </button>
          </div>
        </div>

        <section className={`relative group ${mode === 'spin' ? '' : 'hidden'}`}>
          <div className="relative bg-[#1a110e] border border-[#3d2b24] rounded-2xl overflow-hidden shadow-2xl p-4 md:p-6">
            <div className="relative rounded-xl overflow-hidden border border-[#3d2b24] bg-black/40">
              <SpinningReel reelItems={reelItems} winner={winner} onSpinEnd={onSpinFinished} />
            </div>

            <div className="flex flex-col items-center mt-6 space-y-6">
              <div className="h-12 flex items-center justify-center">
                {winner && showWinnerName && !isSpinning ? (
                  <div className="text-center animate-fade-in">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#E19D37] mb-1 block font-bold">Selection Ready</span>
                    <p className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide">
                      {winner.name}
                    </p>
                  </div>
                ) : (
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#505050] font-bold"></span>
                )}
              </div>

              <button
                onClick={handleStartSpin}
                disabled={poolArray.length < 2 || isSpinning}
                className="px-12 py-3 bg-[#E19D37] hover:bg-[#c98a2d] disabled:bg-[#2D2D2D] disabled:opacity-50 text-black font-bold rounded-lg transition-all shadow-[0_4px_0_0_#8e6120] active:translate-y-[2px] active:shadow-none uppercase tracking-widest text-lg"
              >
                {isSpinning ? 'System Spinning...' : 'Engage Spin'}
              </button>
            </div>

            <HistoryList
              history={spinHistory}
              onClear={() => {
                setSpinHistory([]);
                localStorage.removeItem('deadlock_spin_history');
              }}
            />
          </div>
        </section>

        <div className={mode === 'party' ? '' : 'hidden'}>
          <PartyRandomizer pool={poolArray} />
        </div>

        <main className="bg-[#121212] border border-[#3d2b24] rounded-2xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 border-b border-[#3d2b24] pb-4 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 uppercase tracking-tighter">Hero Pool</h2>
              <p className="text-[#A0A0A0] text-xs">Select which heroes to include in the randomization.</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-[#E19D37] font-bold">{roulettePool.size} / {allHeroes.length} <span className="text-[#505050] font-normal">Active</span></span>
              <div className="h-4 w-[1px] bg-[#3d2b24]" />
              <button onClick={clearPool} className="text-[#808080] hover:text-white transition-colors uppercase font-bold">Deselect All</button>
              <button onClick={resetPool} className="text-[#808080] hover:text-[#E19D37] transition-colors uppercase font-bold">Reset</button>
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-2 md:gap-3">
            {allHeroes.map((hero) => (
              <HeroCard key={hero.id} hero={hero} isSelected={roulettePool.has(hero)} onClick={toggleHero} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
