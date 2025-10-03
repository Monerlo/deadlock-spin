import { useState, useEffect, useRef, memo } from 'react';

// --- Типи, перенесені з інших файлів для усунення помилок імпорту ---

export interface Hero {
  id: number;
  name: string;
  images: {
    icon_hero_card: string;
    icon_image_small: string;
  };
  player_selectable: boolean; 
  disabled: boolean;          
}

export type Priority = 1 | 2 | 3;

// --- Компоненти, перенесені в цей файл ---

// Вміст SpinningReel.tsx
const WINNER_POSITION = 90; 
const CARD_WIDTH = 96;
const GAP_WIDTH = 8;

function SpinningReel({ reelItems, winner, onSpinEnd }: { reelItems: Hero[], winner: Hero | null, onSpinEnd: () => void }) {
  const [style, setStyle] = useState<React.CSSProperties>({ transform: 'translateX(0px)' });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (winner && containerRef.current) {
      setStyle({ transition: 'none', transform: 'translateX(0px)' });
      const timer = setTimeout(() => {
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          const totalCardSpace = CARD_WIDTH + GAP_WIDTH;
          const winnerOffset = WINNER_POSITION * totalCardSpace;
          const finalPositionPx = (containerWidth / 2) - (CARD_WIDTH / 2) - winnerOffset;
          setStyle({
            transform: `translateX(${finalPositionPx}px)`,
            transition: 'transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)',
          });
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setStyle({ transition: 'none', transform: 'translateX(0px)' });
    }
  }, [winner, reelItems]);

  return (
    <div ref={containerRef} className="relative w-full h-24 bg-[#121212] border-y border-[#2D2D2D] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-[#C09B54] z-20"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-full bg-[#C09B54]/20 z-10"></div>
      <div
        className="h-full flex items-center absolute top-0 left-0 gap-2"
        style={style}
        onTransitionEnd={winner ? onSpinEnd : undefined}
      >
        {reelItems.map((hero, index) => (
          <div key={hero ? `${hero.id}-${index}` : index} className="flex-shrink-0 w-24 h-24 p-2" style={{ boxSizing: 'border-box' }}>
            {hero && <img src={hero.images.icon_hero_card} alt={hero.name} className="w-full h-full object-contain opacity-60" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// Вміст HeroCard.tsx
const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.7))]">
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

const priorityToBorderClass = (priority: Priority | null): string => {
    if (!priority) return 'border-transparent';
    switch (priority) {
        case 3: return 'border-[#8A2BE2]'; // Фіолетовий
        case 2: return 'border-yellow-400';   // Яскраво-жовтий
        case 1: return 'border-[#808080]'; // Сірий
        default: return 'border-transparent';
    }
}

const HeroCardComponent = ({ hero, isSelected, onClick, priority = null, customBorderClass }: { hero: Hero, isSelected: boolean, onClick: (hero: Hero) => void, priority?: Priority | null, customBorderClass?: string }) => {
  const borderClass = customBorderClass || (isSelected && !priority ? 'border-[#C09B54]' : priorityToBorderClass(priority));
  
  return (
    <div
      onClick={() => onClick(hero)}
      className={`relative bg-[#121212] border-2 transform transition-all duration-200 ${borderClass} ${isSelected ? 'scale-105' : ''} ${!priority && !isSelected ? 'hover:border-[#C09B54]/50' : ''} cursor-pointer w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center overflow-hidden`}
      title={hero.name}
    >
      <img src={hero.images.icon_hero_card} alt={hero.name} className="w-full h-full object-cover" loading="lazy" />
      {priority && (
        <div className="absolute bottom-1 left-1 flex flex-col gap-[-4px] bg-black/70 p-1 rounded-md pointer-events-none">
          {priority === 3 && <ChevronIcon />}
          {priority >= 2 && <ChevronIcon />}
        </div>
      )}
    </div>
  );
}
const HeroCard = memo(HeroCardComponent);

// --- Компонент для керування анімацією ---
const AnimationControls = ({ onSkipCurrent, onSkipAll, onCancel }: { onSkipCurrent: () => void, onSkipAll: () => void, onCancel: () => void }) => (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button
            onClick={onSkipCurrent}
            className="bg-transparent border border-[#A0A0A0] text-[#A0A0A0] hover:bg-[#2D2D2D] font-semibold py-2 px-5 transition-colors text-sm"
        >
            Skip
        </button>
        <button
            onClick={onSkipAll}
            className="bg-transparent border border-[#A0A0A0] text-[#A0A0A0] hover:bg-[#2D2D2D] font-semibold py-2 px-5 transition-colors text-sm"
        >
            Skip to End
        </button>
        <button
            onClick={onCancel}
            className="bg-[#6b2121] border border-[#a33232] text-white hover:bg-[#8f2c2c] font-semibold py-2 px-5 transition-colors text-sm"
        >
            Cancel
        </button>
    </div>
);


// --- МОДАЛЬНЕ ВІКНО анімації пріоритету ---
const PrioritySpinModal = ({ hero, finalPriority, onAnimationEnd, onSkipCurrent, onSkipAll, onCancel }: { hero: Hero, finalPriority: Priority, onAnimationEnd: () => void, onSkipCurrent: () => void, onSkipAll: () => void, onCancel: () => void }) => {
    const [currentBorderClass, setCurrentBorderClass] = useState('border-transparent');
    const animationInterval = useRef<number | null>(null);
    const animationTimeout = useRef<number | null>(null);

    useEffect(() => {
        const priorities: Priority[] = [1, 2, 3];
        let speed = 75;
        let cycles = 0;

        const animate = () => {
            cycles++;
            const randomIndex = Math.floor(Math.random() * priorities.length);
            setCurrentBorderClass(priorityToBorderClass(priorities[randomIndex]));

            if (cycles > 15 && speed < 150) speed = 150;
            if (cycles > 22 && speed < 300) speed = 300;
            if (cycles > 26 && speed < 500) speed = 500;
            
            animationInterval.current = window.setTimeout(animate, speed);
        };

        animate();

        animationTimeout.current = window.setTimeout(() => {
            if (animationInterval.current) clearTimeout(animationInterval.current);
            setCurrentBorderClass(priorityToBorderClass(finalPriority));
            setTimeout(onAnimationEnd, 1000); 
        }, 4000); 

        return () => {
            if (animationInterval.current) clearTimeout(animationInterval.current);
            if (animationTimeout.current) clearTimeout(animationTimeout.current);
        };
    }, [finalPriority, onAnimationEnd]);
    
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className={`bg-[#1A1A1A] border-4 ${currentBorderClass} shadow-2xl p-6 flex flex-col items-center gap-4`}>
                 <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">{hero.name}</h2>
                 <img src={hero.images.icon_hero_card} alt={hero.name} className="w-32 h-32 sm:w-48 sm:h-48 object-cover" />
                 <p className="text-[#A0A0A0] text-base sm:text-lg">Assigning Priority...</p>
                 <AnimationControls onSkipCurrent={onSkipCurrent} onSkipAll={onSkipAll} onCancel={onCancel} />
            </div>
        </div>
    );
};


// --- Основний компонент та його логіка ---

interface PrioritizedHero {
    hero: Hero;
    priority: Priority | null;
}

interface PlayerResult {
  playerNumber: number; 
  heroes: PrioritizedHero[];
}

const HeroPlaceholder = () => (
    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#1A1A1A] border-2 border-[#2D2D2D]"></div>
);

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
  const [error, setError] = useState('');
  const [isPriorityMode, setIsPriorityMode] = useState(false);
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalResults, setFinalResults] = useState<PlayerResult[]>([]);
  const [revealedSlots, setRevealedSlots] = useState<Set<string>>(new Set());
  
  const [isHeroSpinModalVisible, setIsHeroSpinModalVisible] = useState(false);
  const [currentSpinData, setCurrentSpinData] = useState<{ reel: Hero[], winner: Hero, key: string } | null>(null);
  
  const [prioritySpinData, setPrioritySpinData] = useState<{ hero: Hero, priority: Priority, key: string } | null>(null);

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    clearState();
  }, [isPriorityMode]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  
  const maxPlayers = 12;
  const maxHeroesPerPlayer = pool.length > 0 ? pool.length : 1;

  const clearState = () => {
    setIsGenerating(false);
    setFinalResults([]);
    setError('');
    setRevealedSlots(new Set());
    setPrioritySpinData(null);
    setIsHeroSpinModalVisible(false);
    setCurrentSpinData(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleSkipToEnd = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setPrioritySpinData(null);
    setIsHeroSpinModalVisible(false);

    const allSlots = new Set<string>();
    for (let p = 0; p < numPlayers; p++) {
      for (let h = 0; h < heroesPerPlayer; h++) {
        allSlots.add(`p${p}-h${h}`);
      }
    }
    setRevealedSlots(allSlots);
    setIsGenerating(false);
  };

  const handleSkipCurrent = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (prioritySpinData) {
        handlePriorityAnimationEnd();
    } else if (isHeroSpinModalVisible) {
        handleSpinEnd();
    }
  };
  
  const handleAddHero = (targetPlayerNumber: number) => {
    setError('');
    setFinalResults(currentResults => {
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
        
        const newPrioritizedHero: PrioritizedHero = { 
            hero: newHero, 
            priority: isPriorityMode 
                ? [1, 2, 3][Math.floor(Math.random() * 3)] as Priority 
                : null 
        };
        
        const newResults = [...currentResults];
        newResults[playerIndex] = {
            ...player,
            heroes: [...player.heroes, newPrioritizedHero]
        };
        
        return newResults;
    });
  };


  const startNextReveal = (results: PlayerResult[], prevKey: string | null = null) => {
    let nextPlayerIndex = 0;
    let nextHeroIndex = 0;

    if (prevKey) {
        const [_, pStr, hStr] = prevKey.match(/p(\d+)-h(\d+)/) || [];
        nextPlayerIndex = (parseInt(pStr, 10) + 1) % numPlayers;
        nextHeroIndex = parseInt(hStr, 10) + (nextPlayerIndex === 0 ? 1 : 0);
    }
    
    if (nextHeroIndex >= heroesPerPlayer) {
        setIsGenerating(false);
        return;
    }
    
    const nextKey = `p${nextPlayerIndex}-h${nextHeroIndex}`;
    const winner = results[nextPlayerIndex].heroes[nextHeroIndex].hero;
    
    const REEL_LENGTH = 100;
    const newReel = [...Array(REEL_LENGTH)].map((_, i) => {
        if (i === WINNER_POSITION) return winner;
        return pool[Math.floor(Math.random() * pool.length)];
    });

    setCurrentSpinData({ reel: newReel, winner, key: nextKey });
    setIsHeroSpinModalVisible(true);
  };
  
  const handlePriorityAnimationEnd = () => {
    if (!prioritySpinData) return;
    const revealedKey = prioritySpinData.key;
    setPrioritySpinData(null); 
    setRevealedSlots(prev => new Set(prev).add(revealedKey)); 

    timeoutRef.current = window.setTimeout(() => {
        startNextReveal(finalResults, revealedKey);
    }, 500);
  };

  const handleSpinEnd = () => {
    if (!currentSpinData) return;
    const revealedKey = currentSpinData.key;
    
    timeoutRef.current = window.setTimeout(() => {
        setIsHeroSpinModalVisible(false);
        setCurrentSpinData(null);

        const [_, pStr, hStr] = revealedKey.match(/p(\d+)-h(\d+)/) || [];
        const playerIndex = parseInt(pStr, 10);
        const heroIndex = parseInt(hStr, 10);
        const { hero, priority } = finalResults[playerIndex].heroes[heroIndex];
        
        if (isPriorityMode && priority && isAnimationEnabled) {
            setPrioritySpinData({ hero, priority, key: revealedKey });
        } else {
            setRevealedSlots(prev => new Set(prev).add(revealedKey));
            timeoutRef.current = window.setTimeout(() => {
                startNextReveal(finalResults, revealedKey);
            }, 1500);
        }
    }, 1000);
  };

  const handleGenerate = () => {
    clearState();
    if (isPriorityMode && pool.length < heroesPerPlayer) {
        setError(`Priority mode requires at least ${heroesPerPlayer} heroes, but pool has ${pool.length}.`);
        return;
    }
    
    const results = isPriorityMode ? generatePriorityTeams() : generateStandardTeams();
    if (results) {
        setFinalResults(results);

        if (isAnimationEnabled) {
            setIsGenerating(true);
            timeoutRef.current = window.setTimeout(() => {
                startNextReveal(results);
            }, 1500);
        } else {
            const allSlots = new Set<string>();
            for (let p = 0; p < numPlayers; p++) {
                for (let h = 0; h < heroesPerPlayer; h++) {
                    allSlots.add(`p${p}-h${h}`);
                }
            }
            setRevealedSlots(allSlots);
        }
    }
  };
  
  const generatePriorityTeams = (): PlayerResult[] | null => {
      const totalHeroesNeeded = numPlayers * heroesPerPlayer;
      const newResults = [];
      const canUseUnique = pool.length >= totalHeroesNeeded;
      const assignRandomPriorities = (heroes: Hero[]): PrioritizedHero[] => {
        const priorities: Priority[] = [1, 2, 3];
        return heroes.map(hero => ({ hero, priority: priorities[Math.floor(Math.random() * priorities.length)] as Priority }));
      };
      
      if (canUseUnique) {
        const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
        let heroIndex = 0;
        for (let i = 0; i < numPlayers; i++) {
          const selectedHeroes = shuffledPool.slice(heroIndex, heroIndex + heroesPerPlayer);
          newResults.push({ playerNumber: i + 1, heroes: assignRandomPriorities(selectedHeroes) });
          heroIndex += heroesPerPlayer;
        }
      } else {
        const megaPool = [...Array(Math.ceil(totalHeroesNeeded / pool.length) + 5)].flatMap(() => pool);
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
          newResults.push({ playerNumber: i + 1, heroes: assignRandomPriorities(playerHeroes) });
        }
      }
      return newResults;
  };
  
  const generateStandardTeams = (): PlayerResult[] => {
      const totalHeroesNeeded = numPlayers * heroesPerPlayer;
      const newResults = [];
      const canUseUnique = pool.length >= totalHeroesNeeded;
      if (canUseUnique) {
        const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
        let heroIndex = 0;
        for (let i = 0; i < numPlayers; i++) {
          const assignedHeroes = shuffledPool.slice(heroIndex, heroIndex + heroesPerPlayer);
          newResults.push({ playerNumber: i + 1, heroes: assignedHeroes.map(h => ({ hero: h, priority: null })) });
          heroIndex += heroesPerPlayer;
        }
      } else {
        const megaPool = [...Array(Math.ceil(totalHeroesNeeded / pool.length) + 5)].flatMap(() => pool);
        const shuffledMegaPool = megaPool.sort(() => 0.5 - Math.random());
        let heroIndex = 0;
        for (let i = 0; i < numPlayers; i++) {
          const assignedHeroes = shuffledMegaPool.slice(heroIndex, heroIndex + heroesPerPlayer);
          newResults.push({ playerNumber: i + 1, heroes: assignedHeroes.map(h => ({ hero: h, priority: null })) });
          heroIndex += heroesPerPlayer;
        }
      }
      return newResults;
  };

  return (
    <>
      <div className="bg-[#121212] border border-[#2D2D2D] p-4 md-p-6 mb-6">
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

        <div className="flex items-center justify-center gap-4">
            <button
            onClick={handleGenerate}
            disabled={pool.length < 2 || isGenerating}
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
        
        {finalResults.length > 0 && !isGenerating && (
            <div className="mt-8 space-y-6">
            {finalResults.map((playerResult, playerIndex) => {
                const canAddMore = playerResult.heroes.length < pool.length;
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
                        <div className="flex flex-wrap items-start gap-3">
                            {playerResult.heroes.map((p_hero, heroIndex) => {
                                const key = `p${playerIndex}-h${heroIndex}`;
                                if (revealedSlots.has(key) || !isGenerating) {
                                    return <HeroCard key={key} hero={p_hero.hero} isSelected={true} onClick={() => {}} priority={p_hero.priority} />;
                                }
                                return <HeroPlaceholder key={key} />;
                            })}
                        </div>
                    </div>
                );
            })}
            </div>
        )}

        {finalResults.length > 0 && isGenerating && (
            <div className="mt-8 space-y-6">
            {finalResults.map((playerResult, playerIndex) => (
                <div key={playerResult.playerNumber} className="border-t border-[#2D2D2D] pt-4">
                    <h4 className="text-lg font-bold text-[#C09B54] mb-3">Player {playerResult.playerNumber}</h4>
                    <div className="flex flex-wrap items-start gap-3">
                    {Array.from({ length: playerResult.heroes.length }).map((_, heroIndex) => {
                        const key = `p${playerIndex}-h${heroIndex}`;
                        if (revealedSlots.has(key)) {
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

