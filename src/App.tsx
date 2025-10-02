import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchHeroes, type Hero } from './services/deadlockApi';
import { SpinningReel } from './components/SpinningReel';
import { HeroCard } from './components/HeroCard';
import { PartyRandomizer } from './components/PartyRandomizer';

const REEL_LENGTH = 100;

const ModeSwitcher = ({ mode, setMode }: { mode: 'spin' | 'party', setMode: (mode: 'spin' | 'party') => void }) => {
  const baseClasses = "w-full py-3 font-bold text-lg transition-colors";
  const activeClasses = "bg-[#C09B54] text-black";
  const inactiveClasses = "bg-[#1A1A1A] text-[#A0A0A0] hover:bg-[#2D2D2D]";

  return (
    <div className="flex w-full max-w-sm mx-auto border-2 border-[#2D2D2D] mb-6">
      <button 
        onClick={() => setMode('spin')}
        className={`${baseClasses} ${mode === 'spin' ? activeClasses : inactiveClasses}`}
      >
        Single Spin
      </button>
      <button 
        onClick={() => setMode('party')}
        className={`${baseClasses} ${mode === 'party' ? activeClasses : inactiveClasses}`}
      >
        Party Mode
      </button>
    </div>
  );
};

function App() {
  const [allHeroes, setAllHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [roulettePool, setRoulettePool] = useState<Set<Hero>>(new Set());
  const [winner, setWinner] = useState<Hero | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [reelItems, setReelItems] = useState<Hero[]>([]);
  const [mode, setMode] = useState<'spin' | 'party'>('spin');

  const poolArray = useMemo(() => Array.from(roulettePool), [roulettePool]);

  useEffect(() => {
    const getHeroes = async () => {
      setLoading(true);
      const fetchedHeroes = await fetchHeroes();
      const activeHeroes = fetchedHeroes.filter(hero =>
        hero.player_selectable === true && hero.disabled === false
      );
      setAllHeroes(activeHeroes);
      setRoulettePool(new Set(activeHeroes));
      
      const initialReel = [...activeHeroes, ...activeHeroes, ...activeHeroes, ...activeHeroes].slice(0, REEL_LENGTH);
      setReelItems(initialReel);

      setLoading(false);
    };
    getHeroes();
  }, []);

  // FIX: This useEffect resets the spin state if the user switches modes mid-animation.
  useEffect(() => {
    if (mode !== 'spin' && !canSpin) {
      setCanSpin(true);
      setWinner(null);
    }
  }, [mode, canSpin]);

  const handleHeroSelect = useCallback((hero: Hero) => {
    if (!canSpin) return;
    setRoulettePool((prevPool) => {
      const newPool = new Set(prevPool);
      if (newPool.has(hero)) {
        newPool.delete(hero);
      } else {
        newPool.add(hero);
      }
      return newPool;
    });
  }, [canSpin]);

  const handleSpin = () => {
    if (poolArray.length < 2 || !canSpin) return;
    
    setCanSpin(false);
    setWinner(null);

    const WINNER_POSITION = 90;
    const newWinner = poolArray[Math.floor(Math.random() * poolArray.length)];
    
    const newReel = [...Array(REEL_LENGTH)].map((_, i) => {
      if (i === WINNER_POSITION) return newWinner;
      return poolArray[Math.floor(Math.random() * poolArray.length)];
    });
    
    // Use a timeout to ensure the state updates before the animation starts
    setTimeout(() => {
        setReelItems(newReel);
        setWinner(newWinner);
    }, 50);
  };

  const handleSpinEnd = () => {
    setCanSpin(true);
  };

  const handleResetPool = () => {
    if (!canSpin) return;
    setRoulettePool(new Set(allHeroes));
    setWinner(null);
  };

  return (
    <div className="bg-[#1A1A1A] text-[#EAEAEA] min-h-screen font-sans p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="max-w-7xl mx-auto space-y-6 w-full">
        <header className="text-center pb-4 border-b border-[#2D2D2D] mb-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-2">Deadlock SPIN</h1>
          <p className="text-[#A0A0A0]">A hero randomizer. Select heroes to include in the pool.</p>
        </header>

        <ModeSwitcher mode={mode} setMode={setMode} />

        {/* --- Spin Mode Section --- */}
        <section className={`bg-[#121212] border border-[#2D2D2D] p-4 md:p-6 mb-6 ${mode === 'spin' ? '' : 'hidden'}`}>
          <SpinningReel reelItems={reelItems} winner={winner} onSpinEnd={handleSpinEnd} />
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
            <button
              onClick={handleSpin}
              disabled={poolArray.length < 2 || !canSpin}
              className="w-full md:w-auto bg-[#C09B54] hover:opacity-90 disabled:bg-[#2D2D2D] disabled:cursor-not-allowed text-black font-bold py-3 px-8 transition-all text-lg"
            >
              {!canSpin ? 'Spinning...' : 'Spin!'}
            </button>
          </div>
          <div className="text-center h-8 mt-4">
            {winner && canSpin && (
              <p className="text-xl text-[#A0A0A0] animate-fade-in-down">
                Winner: <span className="font-bold text-[#C09B54]">{winner.name}</span>
              </p>
            )}
             {poolArray.length < 2 && canSpin && (
                <p className="text-[#A0A0A0] text-sm italic">Select at least 2 heroes to spin.</p>
            )}
          </div>
        </section>
        
        {/* --- Party Mode Section --- */}
        <div className={mode === 'party' ? '' : 'hidden'}>
          <PartyRandomizer pool={poolArray} />
        </div>

        <main className="bg-[#121212] border border-[#2D2D2D] p-4 md:p-6">
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold text-[#EAEAEA]">
               Select Heroes for the Pool ({roulettePool.size}/{allHeroes.length})
             </h2>
             <button
                onClick={handleResetPool}
                disabled={!canSpin}
                className="bg-[#121212] border border-[#2D2D2D] hover:bg-[#2D2D2D] disabled:opacity-50 text-[#A0A0A0] font-bold py-2 px-5 transition-colors text-sm"
              >
                Reset Pool
              </button>
           </div>
          {loading ? (
            <p className="text-center text-[#A0A0A0]">Loading heroes...</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
              {allHeroes.map((hero) => (
                <HeroCard
                  key={hero.id}
                  hero={hero}
                  isSelected={roulettePool.has(hero)}
                  onClick={handleHeroSelect}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      

      <footer className="w-full mt-auto pt-8 text-center text-[#A0A0A0] text-sm">
        <div className="max-w-7xl mx-auto border-t border-[#2D2D2D] py-4">
          <p>This is a fan-made website. Not affiliated with Valve or the Deadlock team.</p>
          <p>Developed by <span className="text-[#C09B54]">bananikruti</span> (Discord). Powered by <a href="https://deadlock-api.com/" target="_blank" rel="noopener noreferrer" className="text-[#C09B54] hover:underline">deadlock-api.com</a>.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

