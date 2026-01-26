import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchHeroes } from '../services/deadlockApi';
import type { Hero } from '../types';

export function useHeroesPool() {
  const [allHeroes, setAllHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [roulettePool, setRoulettePool] = useState<Set<Hero>>(new Set());

  
  useEffect(() => {
    const getHeroes = async () => {
      setLoading(true);
      const fetchedHeroes = await fetchHeroes();
      const activeHeroes = fetchedHeroes.filter(hero =>
        hero.player_selectable === true && hero.disabled === false
      );
      setAllHeroes(activeHeroes);
      setRoulettePool(new Set(activeHeroes));
      setLoading(false);
    };
    getHeroes();
  }, []);

  
  const poolArray = useMemo(() => Array.from(roulettePool), [roulettePool]);

  
  const toggleHero = useCallback((hero: Hero) => {
    setRoulettePool((prevPool) => {
      const newPool = new Set(prevPool);
      if (newPool.has(hero)) {
        newPool.delete(hero);
      } else {
        newPool.add(hero);
      }
      return newPool;
    });
  }, []);

  const resetPool = useCallback(() => {
    setRoulettePool(new Set(allHeroes));
  }, [allHeroes]);

  const clearPool = useCallback(() => {
    setRoulettePool(new Set());
  }, []);

  return {
    allHeroes,
    poolArray,
    roulettePool, 
    loading,
    toggleHero,
    resetPool,
    clearPool
  };
}