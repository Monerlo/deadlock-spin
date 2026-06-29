import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHeroesPool } from '../hooks/useHeroesPool';
import type { Hero } from '../types';

export const BuildsTeaser = () => {
  const { allHeroes } = useHeroesPool();
  const [featuredHero, setFeaturedHero] = useState<Hero | null>(null);

  useEffect(() => {
    if (allHeroes.length > 0 && !featuredHero) {
      setFeaturedHero(allHeroes[Math.floor(Math.random() * allHeroes.length)]);
    }
  }, [allHeroes]);

  // Дублюємо для безшовного loop
  const marqueeHeroes = allHeroes.length > 0 ? [...allHeroes, ...allHeroes] : [];
  const heroPortrait = featuredHero?.images.icon_hero_card;

  return (
    <Link to="/builds" className="block group relative overflow-hidden h-full bg-[#0a0603] border-b border-[#3d2b24]">

      {/* Декоративний glow */}
      <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#E19D37]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 top-0 w-96 h-full bg-gradient-to-r from-black/60 to-transparent pointer-events-none z-[1]" />

      <div className="relative h-full flex flex-col z-10">

        {/* Основний контент */}
        <div className="flex-1 flex items-center overflow-hidden min-h-0">

          {/* Ліво: текст */}
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 py-3 z-10">

            <div className="mb-2">
              <span
                className="inline-block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-black px-2.5 py-[3px] rounded"
                style={{
                  background: 'linear-gradient(90deg, #E19D37, #f5c060)',
                  boxShadow: '0 0 14px rgba(225,157,55,0.45)',
                }}
              >
                NEW
              </span>
            </div>

            <h2
              className="text-2xl sm:text-4xl md:text-5xl text-[#FFEFD7] leading-none tracking-wide mb-1.5 sm:mb-2.5 drop-shadow-lg"
              style={{ fontFamily: "'Luckiest Guy', cursive" }}
            >
              PRO BUILDS
            </h2>

            <p className="text-[#606060] text-[10px] sm:text-xs max-w-[220px] sm:max-w-xs leading-relaxed mb-3 sm:mb-5">
              Real competitive builds from dem.gg tournaments
            </p>

            <div className="flex items-center gap-2 text-[#E19D37] text-[11px] sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 group-hover:gap-4">
              <span>Explore</span>
              <span>→</span>
            </div>
          </div>

          {/* Право: портрет героя */}
          <div className="relative w-28 sm:w-44 md:w-56 h-full flex-shrink-0 overflow-hidden">
            {heroPortrait && (
              <img
                src={heroPortrait}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-top opacity-50 group-hover:opacity-70 scale-110 group-hover:scale-100 transition-all duration-700"
              />
            )}
            {/* Градієнт зліва */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0603] via-[#0a0603]/40 to-transparent" />
            {/* Градієнт знизу */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0603]/80" />
          </div>
        </div>

        {/* Низ: скролінг героїв */}
        {marqueeHeroes.length > 0 && (
          <div className="h-9 sm:h-11 overflow-hidden relative border-t border-[#2a1a0e]/60 flex-shrink-0">
            <div
              className="flex gap-1 items-center h-full px-1"
              style={{ animation: 'builds-marquee 35s linear infinite', width: 'max-content' }}
            >
              {marqueeHeroes.map((hero, i) => (
                <img
                  key={`${hero.id}-${i}`}
                  src={hero.images.icon_hero_card ?? ''}
                  alt={hero.name}
                  className="h-7 sm:h-9 w-auto aspect-[3/4] object-cover object-top rounded-sm opacity-30 group-hover:opacity-50 transition-opacity duration-500 flex-shrink-0"
                />
              ))}
            </div>
            {/* Fade по краях */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a0603] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0603] to-transparent pointer-events-none z-10" />
          </div>
        )}
      </div>

      <style>{`
        @keyframes builds-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </Link>
  );
};