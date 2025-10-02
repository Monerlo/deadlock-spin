import { useState, useEffect,} from 'react';
import type { Hero } from '../services/deadlockApi';
import { HeroCard, type Priority } from './HeroCard';

interface PrioritizedHero {
    hero: Hero;
    priority: Priority | null;
}

const CustomNumberInput = ({ label, value, onChange, min, max, disabled = false }: {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const rawValue = e.target.value;
    if (rawValue === '') {
      onChange(min);
      return;
    }
    let numValue = parseInt(rawValue, 10);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange(clampedValue);
    }
  };
  
  return (
    <div className={`flex flex-col items-start gap-2 ${disabled ? 'opacity-50' : ''}`}>
      <label className="text-[#A0A0A0] font-semibold text-lg">{label}</label>
      <div className="w-44 h-14 bg-[#1A1A1A] border-2 border-[#2D2D2D] p-1">
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          disabled={disabled}
          className="w-full h-full bg-transparent text-center text-white font-mono text-3xl outline-none appearance-textfield 
                     [&::-webkit-outer-spin-button]:h-full [&::-webkit-outer-spin-button]:opacity-50
                     [&::-webkit-inner-spin-button]:h-full [&::-webkit-inner-spin-button]:opacity-50"
        />
      </div>
    </div>
  );
};

interface PartyRandomizerProps {
  pool: Hero[];
}

export function PartyRandomizer({ pool }: PartyRandomizerProps) {
  const [numPlayers, setNumPlayers] = useState(2);
  const [heroesPerPlayer, setHeroesPerPlayer] = useState(1);
  const [results, setResults] = useState<{ playerNumber: number; heroes: PrioritizedHero[]; initialCount: number }[]>([]);
  const [error, setError] = useState('');
  const [isPriorityMode, setIsPriorityMode] = useState(false);

  useEffect(() => {
    clearState();
  }, [isPriorityMode]);

  const maxPlayers = 12;
  const maxHeroesPerPlayer = pool.length > 0 ? pool.length : 1;

  const clearState = () => {
    setResults([]);
    setError('');
  };

  const handleGenerate = () => {
    clearState();
    if (isPriorityMode) {
      generatePriorityTeams();
    } else {
      generateStandardTeams();
    }
  };
  
  const handleAddHero = (targetPlayerNumber: number) => {
    setError('');
    setResults(currentResults => {
        const playerIndex = currentResults.findIndex(p => p.playerNumber === targetPlayerNumber);
        if (playerIndex === -1) return currentResults;

        const player = currentResults[playerIndex];
        const playerHeroIds = new Set(player.heroes.map(h => h.hero.id));

        const availableHeroes = pool.filter(hero => !playerHeroIds.has(hero.id));

        if (availableHeroes.length === 0) {
            setError(`Player ${targetPlayerNumber} can't get more unique heroes.`);
            return currentResults;
        }

        const newHero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];
        
        const priorities: Priority[] = [1, 2, 3];
        const randomPriority = isPriorityMode
          ? priorities[Math.floor(Math.random() * priorities.length)]
          : null;

        const newPrioritizedHero: PrioritizedHero = { hero: newHero, priority: randomPriority };
        
        const newResults = [...currentResults];
        newResults[playerIndex] = {
            ...player,
            heroes: [...player.heroes, newPrioritizedHero]
        };
        
        return newResults;
    });
  };

  const generatePriorityTeams = () => {
    if (pool.length < heroesPerPlayer) {
      setError(`Priority mode requires at least ${heroesPerPlayer} heroes in the pool, but you only have ${pool.length}.`);
      return;
    }
    
    const totalHeroesNeeded = numPlayers * heroesPerPlayer;
    const newResults = [];
    const canUseUnique = pool.length >= totalHeroesNeeded;

    const assignRandomPriorities = (heroes: Hero[]): PrioritizedHero[] => {
      const priorities: Priority[] = [1, 2, 3];
      return heroes.map(hero => ({
        hero,
        priority: priorities[Math.floor(Math.random() * priorities.length)] as Priority
      }));
    };
    
    if (canUseUnique) {
      const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
      let heroIndex = 0;
      for (let i = 0; i < numPlayers; i++) {
        const selectedHeroes = shuffledPool.slice(heroIndex, heroIndex + heroesPerPlayer);
        const prioritizedHeroes = assignRandomPriorities(selectedHeroes);
        newResults.push({ playerNumber: i + 1, heroes: prioritizedHeroes, initialCount: heroesPerPlayer });
        heroIndex += heroesPerPlayer;
      }
    } else {
      const megaPool = [];
      const multiplier = Math.ceil(totalHeroesNeeded / pool.length) + 5;
      for (let i = 0; i < multiplier; i++) {
        megaPool.push(...pool);
      }
      const shuffledMegaPool = megaPool.sort(() => 0.5 - Math.random());
      let heroIndex = 0;

      for (let i = 0; i < numPlayers; i++) {
        const playerHeroes: Hero[] = [];
        const usedInPlayer = new Set();
        
        while(playerHeroes.length < heroesPerPlayer) {
          const candidate = shuffledMegaPool[heroIndex++];
          if (!usedInPlayer.has(candidate.id)) {
            playerHeroes.push(candidate);
            usedInPlayer.add(candidate.id);
          }
        }
        const prioritizedHeroes = assignRandomPriorities(playerHeroes);
        newResults.push({ playerNumber: i + 1, heroes: prioritizedHeroes, initialCount: heroesPerPlayer });
      }
    }
    setResults(newResults);
  };
  
  const generateStandardTeams = () => {
    const totalHeroesNeeded = numPlayers * heroesPerPlayer;
    const canUseUnique = pool.length >= totalHeroesNeeded;
    const newResults = [];

    if (canUseUnique) {
      const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
      let heroIndex = 0;
      for (let i = 0; i < numPlayers; i++) {
        const assignedHeroes = shuffledPool.slice(heroIndex, heroIndex + heroesPerPlayer);
        const heroesWithNullPriority = assignedHeroes.map(hero => ({ hero, priority: null }));
        newResults.push({ playerNumber: i + 1, heroes: heroesWithNullPriority, initialCount: heroesPerPlayer });
        heroIndex += heroesPerPlayer;
      }
    } else {
      const megaPool = [];
      const multiplier = Math.ceil(totalHeroesNeeded / pool.length) + 5;
      for (let i = 0; i < multiplier; i++) {
        megaPool.push(...pool);
      }
      const shuffledMegaPool = megaPool.sort(() => 0.5 - Math.random());
      let heroIndex = 0;

      for (let i = 0; i < numPlayers; i++) {
        const assignedHeroes = shuffledMegaPool.slice(heroIndex, heroIndex + heroesPerPlayer);
        const heroesWithNullPriority = assignedHeroes.map(hero => ({ hero, priority: null }));
        newResults.push({ playerNumber: i + 1, heroes: heroesWithNullPriority, initialCount: heroesPerPlayer });
        heroIndex += heroesPerPlayer;
      }
    }
    setResults(newResults);
  };

  return (
    <div className="bg-[#121212] border border-[#2D2D2D] p-4 md-p-6 mb-6">
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <button
          onClick={() => setIsPriorityMode(!isPriorityMode)}
          className={`font-bold py-2 px-6 border-2 transition-colors ${
            isPriorityMode 
              ? 'bg-[#C09B54] text-black border-[#C09B54]' 
              : 'bg-transparent text-[#A0A0A0] border-[#2D2D2D] hover:bg-[#2D2D2D]'
          }`}
        >
          {isPriorityMode ? 'Priority Mode: ON' : 'Priority Mode: OFF'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
        <CustomNumberInput 
          label="Number of Players:"
          value={numPlayers}
          onChange={setNumPlayers}
          min={1}
          max={maxPlayers}
        />
        <CustomNumberInput 
          label="Heroes per Player:"
          value={heroesPerPlayer}
          onChange={setHeroesPerPlayer}
          min={1}
          max={maxHeroesPerPlayer}
        />
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={pool.length === 0}
          className="bg-[#C09B54] hover:opacity-90 disabled:bg-[#2D2D2D] disabled:cursor-not-allowed text-black font-bold py-3 px-8 transition-all text-lg"
        >
          Generate Teams
        </button>
        {results.length > 0 && (
          <button
            onClick={clearState}
            className="bg-[#121212] border border-[#2D2D2D] hover:bg-[#2D2D2D] text-[#EAEAEA] font-bold py-3 px-8 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {error && <p className="text-center text-red-500 font-bold mt-4">{error}</p>}
      
      {results.length > 0 && (
        <div className="mt-8 space-y-6">
          {results.map(playerResult => {
            const canAddMore = playerResult.heroes.length < pool.length;
            const initialHeroes = playerResult.heroes.slice(0, playerResult.initialCount);
            const addedHeroes = playerResult.heroes.slice(playerResult.initialCount);

            return (
              <div key={playerResult.playerNumber} className="border-t border-[#2D2D2D] pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-bold text-[#C09B54]">Player {playerResult.playerNumber}</h4>
                  <button
                    onClick={() => handleAddHero(playerResult.playerNumber)}
                    disabled={!canAddMore}
                    className="bg-[#1A1A1A] border border-[#2D2D2D] hover:bg-[#2D2D2D] disabled:opacity-50 disabled:cursor-not-allowed text-sm text-[#A0A0A0] font-semibold py-1 px-3"
                    title={canAddMore ? "Add a random unique hero" : "No more unique heroes available"}
                  >
                    + Add Hero
                  </button>
                </div>
                {/* Змінено items-center на items-start для виправлення зсуву */}
                <div className="flex flex-wrap items-start gap-3">
                  {initialHeroes.map((p_hero) => (
                    <HeroCard
                      key={`${p_hero.hero.id}-${p_hero.priority || 'no-priority'}-${playerResult.playerNumber}-initial`}
                      hero={p_hero.hero}
                      isSelected={true}
                      onClick={() => {}}
                      priority={p_hero.priority}
                    />
                  ))}

                  {addedHeroes.length > 0 && (
                     <div className="h-24 w-px bg-[#4A4A4A] mx-2 self-stretch"></div>
                  )}

                  {addedHeroes.map((p_hero) => (
                    <HeroCard
                       key={`${p_hero.hero.id}-${p_hero.priority || 'no-priority'}-${playerResult.playerNumber}-added`}
                       hero={p_hero.hero}
                       isSelected={true}
                       onClick={() => {}}
                       priority={p_hero.priority}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

