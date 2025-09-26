import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchHeroes, type Hero } from './services/deadlockApi';
import { SpinningReel } from './components/SpinningReel';
import { HeroCard } from './components/HeroCard';

const REEL_LENGTH = 100;
const WINNER_POSITION = REEL_LENGTH - 10;

function App() {
  const [allHeroes, setAllHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [roulettePool, setRoulettePool] = useState<Set<Hero>>(new Set());
  const [winner, setWinner] = useState<Hero | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [reelItems, setReelItems] = useState<Hero[]>([]);

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
    setReelItems([...poolArray, ...poolArray].slice(0, REEL_LENGTH));

    setTimeout(() => {
      const newWinner = poolArray[Math.floor(Math.random() * poolArray.length)];
      setWinner(newWinner);
      
      const newReel = [...Array(REEL_LENGTH)].map((_, i) => {
        if (i === WINNER_POSITION) return newWinner;
        return poolArray[Math.floor(Math.random() * poolArray.length)];
      });
      setReelItems(newReel);

    }, 100);
  };

  const handleSpinEnd = () => {
    setCanSpin(true);
  };

  const handleResetPool = () => {
    if (!canSpin) return;
    setRoulettePool(new Set(allHeroes));
    setWinner(null);
    setReelItems([...allHeroes, ...allHeroes].slice(0, REEL_LENGTH));
  };

  return (
    <div className="bg-[#1A1A1A] text-[#EAEAEA] min-h-screen font-sans p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="max-w-7xl mx-auto space-y-6 w-full">
        <header className="text-center pb-4 border-b border-[#2D2D2D] mb-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-2">Deadlock SPIN</h1>
          <p className="text-[#A0A0A0]">A hero randomizer. Select heroes to include in the pool.</p>
        </header>

        <section className="bg-[#121212] border border-[#2D2D2D] p-4 md:p-6 mb-6">
          <SpinningReel reelItems={reelItems} winner={winner} onSpinEnd={handleSpinEnd} />
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
            <button
              onClick={handleSpin}
              disabled={poolArray.length < 2 || !canSpin}
              className="w-full md:w-auto bg-[#C09B54] hover:opacity-90 disabled:bg-[#2D2D2D] disabled:cursor-not-allowed text-black font-bold py-3 px-8 transition-all text-lg"
            >
              {!canSpin ? 'Spinning...' : 'Spin!'}
            </button>
             <button
              onClick={handleResetPool}
              disabled={!canSpin}
              className="w-full md:w-auto bg-[#121212] border border-[#2D2D2D] hover:bg-[#2D2D2D] disabled:opacity-50 text-[#EAEAEA] font-bold py-3 px-8 transition-colors"
            >
              Reset Pool
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

        <main className="bg-[#121212] border border-[#2D2D2D] p-4 md:p-6">
           <h2 className="text-xl font-bold mb-4 text-[#EAEAEA]">
             Select Heroes for the Pool ({roulettePool.size}/{allHeroes.length})
           </h2>
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

