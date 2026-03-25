import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { fetchHeroes } from '../services/deadlockApi';
import type { Hero } from '../types';

interface HeroesContextType {
  allHeroes: Hero[];
  loading: boolean;
}

const HeroesContext = createContext<HeroesContextType>({
  allHeroes: [],
  loading: true,
});

export function HeroesProvider({ children }: { children: ReactNode }) {
  const [allHeroes, setAllHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroes().then((heroes) => {
      setAllHeroes(heroes.filter((h) => h.player_selectable && !h.disabled));
      setLoading(false);
    });
  }, []);

  return (
    <HeroesContext.Provider value={{ allHeroes, loading }}>
      {children}
    </HeroesContext.Provider>
  );
}

export const useHeroesContext = () => useContext(HeroesContext);
