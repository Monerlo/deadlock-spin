import { useState, useEffect } from 'react';
import type { Hero } from '../types';
import { HeroCard } from './HeroCard';

interface SlotProps {
  heroes: Hero[];
  initialDelay: number;
}

const HeroSlot = ({ heroes, initialDelay }: SlotProps) => {
  const [current, setCurrent] = useState<Hero | null>(null);
  const [visible, setVisible] = useState(true);

  // Встановлюємо першого героя зі стаггером
  useEffect(() => {
    if (!heroes.length) return;
    const t = setTimeout(() => {
      setCurrent(heroes[Math.floor(Math.random() * heroes.length)]);
    }, initialDelay);
    return () => clearTimeout(t);
  }, [heroes.length]);

  // Після кожної зміни — плануємо наступну через рандомний інтервал
  useEffect(() => {
    if (!current || heroes.length < 2) return;

    const delay = 6000 + Math.random() * 8000; // 6–14 секунд
    let swapTimer: ReturnType<typeof setTimeout>;

    const outerTimer = setTimeout(() => {
      setVisible(false);
      swapTimer = setTimeout(() => {
        const pool = heroes.filter(h => h.id !== current.id);
        setCurrent(pool[Math.floor(Math.random() * pool.length)]);
        setVisible(true);
      }, 380);
    }, delay);

    return () => {
      clearTimeout(outerTimer);
      clearTimeout(swapTimer);
    };
  }, [current]);

  if (!current) {
    return (
      <div className="w-16 sm:w-20 md:w-24 aspect-[3/4] rounded-lg bg-white/10 animate-pulse border border-white/5" />
    );
  }

  return (
    <div
      className="w-16 sm:w-20 md:w-24 aspect-[3/4] relative"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.38s ease-in-out' }}
    >
      <HeroCard
        hero={current}
        isSelected={true}
        onClick={() => {}}
        className="border-white/20 shadow-lg"
      />
    </div>
  );
};

export const RotatingHeroGrid = ({ heroes }: { heroes: Hero[] }) => (
  <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
    {Array.from({ length: 6 }, (_, i) => (
      <HeroSlot key={i} heroes={heroes} initialDelay={i * 300} />
    ))}
  </div>
);