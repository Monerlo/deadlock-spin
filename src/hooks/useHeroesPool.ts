import { useState, useCallback, useMemo } from 'react';
import { useHeroesContext } from '../context/HeroesContext';
import type { Hero } from '../types';

export function useHeroesPool() {
  const { allHeroes, loading } = useHeroesContext();
  const [roulettePool, setRoulettePool] = useState<Set<Hero>>(new Set());

  useMemo(() => {
    if (allHeroes.length > 0 && roulettePool.size === 0) {
      setRoulettePool(new Set(allHeroes));
    }
  }, [allHeroes]);

  const poolArray = useMemo(() => Array.from(roulettePool), [roulettePool]);

  const toggleHero = useCallback((hero: Hero) => {
    setRoulettePool((prev) => {
      const next = new Set(prev);
      if (next.has(hero)) {
        next.delete(hero);
      } else {
        next.add(hero);
      }
      return next;
    });
  }, []);

  const resetPool = useCallback(() => {
    setRoulettePool(new Set(allHeroes));
  }, [allHeroes]);

  const clearPool = useCallback(() => {
    setRoulettePool(new Set());
  }, []);

  return { allHeroes, poolArray, roulettePool, loading, toggleHero, resetPool, clearPool };
}