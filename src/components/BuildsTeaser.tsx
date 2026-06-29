import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRandomBuild, getDlItemsMap, type RandomBuild } from '../services/demGgApi';
import { useHeroesPool } from '../hooks/useHeroesPool';

export const BuildsTeaser = () => {
  const { allHeroes } = useHeroesPool();
  const [build, setBuild] = useState<RandomBuild | null>(null);
  const [itemImgs, setItemImgs] = useState<string[]>([]);

  useEffect(() => {
    fetchRandomBuild()
      .then(async result => {
        if (!result) return;
        setBuild(result);

        // Підтягуємо зображення айтемів з deadlock-api.com
        try {
          const map = await getDlItemsMap();
          const imgs = result.player.items
            .map(item => {
              const full = map.get(Number(item.id));
              return full?.shop_image_webp ?? full?.image_webp ?? null;
            })
            .filter((url): url is string => Boolean(url));
          setItemImgs(imgs);
        } catch {
          // fallback: use imageUrl from dem.gg
          setItemImgs(
            result.player.items
              .map(i => i.imageUrl)
              .filter((u): u is string => Boolean(u))
          );
        }
      })
      .catch(() => {});
  }, []);

  const heroPortrait = build?.player
    ? (allHeroes.find(h => h.name.toLowerCase() === build.player.heroName.toLowerCase())?.images.icon_hero_card
      ?? build.player.heroImageUrl)
    : null;

  // Дублюємо для безшовного loop
  const marqueeImgs = itemImgs.length > 0 ? [...itemImgs, ...itemImgs, ...itemImgs] : [];

  return (
    <Link to="/builds" className="block group relative overflow-hidden h-full bg-[#0a0603] border-b border-[#3d2b24]">

      {/* Декоративний glow */}
      <div className="absolute right-1/3 top-0 bottom-0 w-80 bg-[#E19D37]/5 blur-3xl pointer-events-none" />

      <div className="relative h-full flex flex-col z-10">

        {/* Основний контент */}
        <div className="flex-1 flex items-stretch overflow-hidden min-h-0">

          {/* Ліво: текст */}
          <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 py-3 z-10 gap-2 min-w-0">

            <span
              className="self-start text-[9px] font-black uppercase tracking-[0.3em] text-black px-2 py-[2px] rounded"
              style={{ background: 'linear-gradient(90deg, #E19D37, #f5c060)', boxShadow: '0 0 10px rgba(225,157,55,0.4)' }}
            >
              NEW
            </span>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-[#FFEFD7] leading-none tracking-wide"
              style={{ fontFamily: "'Luckiest Guy', cursive" }}
            >
              PRO BUILDS
            </h2>

            {/* Живі дані */}
            {build ? (
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-white font-black text-sm sm:text-base uppercase tracking-tight truncate">
                  {build.player.playerName ?? `Player #${build.player.playerId}`}
                </p>
                <p className="text-[#808080] text-[10px] sm:text-xs truncate">
                  {build.player.heroName} · {build.match.event?.name ?? 'Tournament'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[#E19D37] text-[11px] font-bold uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
              <span>Explore</span><span>→</span>
            </div>
          </div>

          {/* Право: портрет героя */}
          <div className="relative w-24 sm:w-40 md:w-52 flex-shrink-0 overflow-hidden">
            {heroPortrait && (
              <img
                src={heroPortrait}
                alt={build?.player.heroName ?? ''}
                className="absolute inset-0 w-full h-full object-cover object-top opacity-60 group-hover:opacity-80 scale-110 group-hover:scale-100 transition-all duration-700"
              />
            )}
            {!heroPortrait && (
              <div className="absolute inset-0 bg-white/5 animate-pulse" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0603] via-[#0a0603]/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0603]/70" />
          </div>
        </div>

        {/* Низ: айтеми що скролляться */}
        <div className="h-9 sm:h-11 overflow-hidden relative border-t border-[#2a1a0e]/60 flex-shrink-0">
          {marqueeImgs.length > 0 ? (
            <div
              className="flex gap-1 items-center h-full px-1"
              style={{ animation: 'builds-marquee 20s linear infinite', width: 'max-content' }}
            >
              {marqueeImgs.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-7 sm:h-9 w-7 sm:w-9 object-contain rounded-sm bg-black/30 opacity-60 group-hover:opacity-90 transition-opacity duration-500 flex-shrink-0 p-0.5"
                />
              ))}
            </div>
          ) : (
            // Skeleton поки айтеми не завантажились
            <div className="flex gap-1 items-center h-full px-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-7 w-7 rounded-sm bg-white/5 animate-pulse flex-shrink-0" />
              ))}
            </div>
          )}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0a0603] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0a0603] to-transparent pointer-events-none z-10" />
        </div>
      </div>

      <style>{`
        @keyframes builds-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.33%); }
        }
      `}</style>
    </Link>
  );
};