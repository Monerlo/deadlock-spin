import { useState, useRef, useEffect } from 'react';
import type { Hero, Priority } from '../types';


interface PrioritizedHero {
    hero: Hero;
    priority: Priority | null;
}

interface PlayerResult {
  playerNumber: number; 
  heroes: PrioritizedHero[];
}


interface UsePartyGeneratorProps {
    pool: Hero[];
    numPlayers: number;
    heroesPerPlayer: number;
    isPriorityMode: boolean;
    isAnimationEnabled: boolean;
}

const WINNER_POSITION = 90;
const REEL_LENGTH = 100;

export function usePartyGenerator({ pool, numPlayers, heroesPerPlayer, isPriorityMode, isAnimationEnabled }: UsePartyGeneratorProps) {
  const [error, setError] = useState('');
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

  const startNextReveal = (results: PlayerResult[], prevKey: string | null = null) => {
    let nextPlayerIndex = 0;
    let nextHeroIndex = 0;

    if (prevKey) {
        const match = prevKey.match(/p(\d+)-h(\d+)/);
        if (match) {
            const [_, pStr, hStr] = match;
            const pNum = parseInt(pStr, 10);
            const hNum = parseInt(hStr, 10);
            nextPlayerIndex = (pNum + 1) % numPlayers;
            nextHeroIndex = hNum + (nextPlayerIndex === 0 ? 1 : 0);
        }
    }
    
    if (nextHeroIndex >= heroesPerPlayer) {
        setIsGenerating(false);
        return;
    }
    
    const nextKey = `p${nextPlayerIndex}-h${nextHeroIndex}`;
    const winner = results[nextPlayerIndex]?.heroes[nextHeroIndex]?.hero;

    if (!winner) {
      setIsGenerating(false);
      return;
    }
    
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

        const match = revealedKey.match(/p(\d+)-h(\d+)/);
        if (match) {
            const [_, pStr, hStr] = match;
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
        }
    }, 1000);
  };

  const generatePriorityTeams = (): PlayerResult[] => {
      const totalHeroesNeeded = numPlayers * heroesPerPlayer;
      const newResults: PlayerResult[] = [];
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
        for (let i = 0; i < numPlayers; i++) {
          const playerHeroes: Hero[] = [];
          const usedInPlayer = new Set<number>();
          while(playerHeroes.length < heroesPerPlayer) {
            // Check if it's even possible to get more unique heroes
            if (usedInPlayer.size >= pool.length) break;
            
            const candidate = pool[Math.floor(Math.random() * pool.length)];
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
      const newResults: PlayerResult[] = [];
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
         for (let i = 0; i < numPlayers; i++) {
          const assignedHeroes: Hero[] = [];
          const usedInPlayer = new Set<number>();
           while(assignedHeroes.length < heroesPerPlayer) {
              if (usedInPlayer.size >= pool.length) break;

              const candidate = pool[Math.floor(Math.random() * pool.length)];
              if (!usedInPlayer.has(candidate.id)) {
                assignedHeroes.push(candidate);
                usedInPlayer.add(candidate.id);
              }
           }
          newResults.push({ playerNumber: i + 1, heroes: assignedHeroes.map(h => ({ hero: h, priority: null })) });
        }
      }
      return newResults;
  };

  const generateTeams = () => {
    clearState();
    if (pool.length < heroesPerPlayer && !isPriorityMode) {
        setError(`Not enough heroes in the pool to give ${heroesPerPlayer} unique heroes to each player.`);
        return;
    }
    if (isPriorityMode && pool.length < heroesPerPlayer) {
        setError(`Priority mode requires at least ${heroesPerPlayer} unique heroes per player, but pool has ${pool.length}.`);
        return;
    }
    
    const results = isPriorityMode ? generatePriorityTeams() : generateStandardTeams();
    setFinalResults(results);

    if (isAnimationEnabled) {
        setIsGenerating(true);
        timeoutRef.current = window.setTimeout(() => {
            startNextReveal(results);
        }, 1500);
    } else {
        const allSlots = new Set<string>();
        for (let p = 0; p < numPlayers; p++) {
          for (let h = 0; h < results[p].heroes.length; h++) {
                allSlots.add(`p${p}-h${h}`);
            }
        }
        setRevealedSlots(allSlots);
    }
  };

  const handleSkipToEnd = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setPrioritySpinData(null);
    setIsHeroSpinModalVisible(false);

    const allSlots = new Set<string>();
    for (let p = 0; p < numPlayers; p++) {
      for (let h = 0; h < finalResults[p].heroes.length; h++) {
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
  
  const addHeroToPlayer = (targetPlayerNumber: number) => {
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

  return {
    state: {
      error,
      isGenerating,
      finalResults,
      revealedSlots,
      isHeroSpinModalVisible,
      currentSpinData,
      prioritySpinData,
    },
    actions: {
      clearState,
      generateTeams,
      handleSkipToEnd,
      handleSkipCurrent,
      addHeroToPlayer,
      handleSpinEnd,
      handlePriorityAnimationEnd
    }
  };
}

