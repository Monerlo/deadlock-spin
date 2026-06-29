import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ItemDeck from '../components/ItemDeck';
import { RotatingHeroGrid } from '../components/RotatingHeroGrid';
import { BuildsTeaser } from '../components/BuildsTeaser';
import { useHeroesPool } from '../hooks/useHeroesPool';

export const HomePage = () => {
  const { allHeroes } = useHeroesPool();

  return (
    <>
      <Helmet>
        <title>Deadlock Randomizer | Hero Picker & Item Build Generator</title>
        <meta name="description" content="The ultimate Deadlock Randomizer. Spin the wheel for random heroes, generate unique item builds, and challenge your friends in Party Mode." />
        <link rel="canonical" href="https://deadlockrandom.site/" />
      </Helmet>

      <div className="absolute inset-0 flex flex-col overflow-hidden">

        {/* ── Банер Pro Builds ── */}
        <div className="h-44 sm:h-52 flex-shrink-0">
          <BuildsTeaser />
        </div>

        {/* ── Items + Heroes панелі ── */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        
        <div className="relative group flex-1 h-[50%] md:h-auto md:w-1/2 overflow-hidden">
          <Link to="/items" className="absolute inset-0 w-full h-full block">
              
              
              <div className="absolute inset-0 bg-item bg-cover bg-center transition-all duration-1000 ease-out group-hover:scale-105 group-hover:brightness-[0.4] brightness-75 md:brightness-100" />

              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  font-black text-white/5 select-none z-0 pointer-events-none leading-none font-['Luckiest_Guy']
                  text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[14rem]"
              >
                 ITEMS
              </div>

              
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-2">
                  
                  
                  <div className="transform transition-transform duration-500 ease-out 
                      /* Mobile: Маленький масштаб */
                      scale-[0.5] sm:scale-75 
                      /* Tablet (iPad): Трохи менше ніж на ПК, посунуто вгору, без ховер-ефекту */
                      md:scale-[0.65] md:-translate-y-8
                      /* Desktop (LG+): Нормальний розмір, ефект при наведенні */
                      lg:scale-90 lg:translate-y-0 lg:group-hover:-translate-y-16"
                  >
                      <ItemDeck />
                  </div>

                  
                  <div className="flex flex-col items-center text-center max-w-xs sm:max-w-md
                      /* Mobile & Tablet: Абсолютно знизу, ЗАВЖДИ ВИДНО */
                      absolute bottom-4 z-30 opacity-100
                      /* Desktop (LG+): Знизу (трохи вище), приховано, з'являється при наведенні */
                      lg:bottom-[15%] lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-4 lg:group-hover:translate-y-0 lg:transition-all lg:duration-500"
                  >
                      <h2 className="text-base sm:text-2xl lg:text-3xl font-black text-[#FFEFD7] font-['Luckiest_Guy'] tracking-wide drop-shadow-lg mb-0.5 md:mb-1">
                          ITEM RANDOMIZER
                      </h2>
                      <p className="text-gray-200 text-[9px] sm:text-xs lg:text-sm font-['Fredoka'] leading-tight drop-shadow-md px-4 line-clamp-2 md:line-clamp-none">
                          Random item generator for <span className="text-amber-400 font-bold">Deadlock</span>. 
                          Test your luck!
                      </p>
                  </div>
              </div>
          </Link>
        </div>

        
        <div className="relative group flex-1 h-[50%] md:h-auto md:w-1/2 overflow-hidden">
          <Link to="/heroes" className="absolute inset-0 w-full h-full block">
              
              
              <div className="absolute inset-0 bg-hero bg-cover bg-center transition-all duration-1000 ease-out group-hover:scale-105 group-hover:brightness-[0.4] brightness-75 md:brightness-100" />

              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  font-black text-white/5 select-none z-0 pointer-events-none leading-none font-['Luckiest_Guy']
                  text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[13rem] whitespace-nowrap"
              >
                 HEROES
              </div>

              
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-2">

                  <div className="flex flex-col items-center transform transition-transform duration-500 ease-out
                      scale-[0.55] sm:scale-80
                      md:scale-[0.65] md:-translate-y-8
                      lg:scale-90 lg:translate-y-0 lg:group-hover:-translate-y-16"
                  >
                    <RotatingHeroGrid heroes={allHeroes} />
                  </div>

                  <div className="flex flex-col items-center text-center max-w-xs sm:max-w-md
                      absolute bottom-4 z-30 opacity-100
                      lg:bottom-[15%] lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-4 lg:group-hover:translate-y-0 lg:transition-all lg:duration-500"
                  >
                      <h2 className="text-base sm:text-2xl lg:text-3xl font-black text-[#FFEFD7] font-['Luckiest_Guy'] tracking-wide drop-shadow-lg mb-0.5 md:mb-1">
                          HERO RANDOMIZER
                      </h2>
                      <p className="text-gray-200 text-[9px] sm:text-xs lg:text-sm font-['Fredoka'] leading-tight drop-shadow-md px-4 line-clamp-2 md:line-clamp-none">
                          Can't decide who to play? Use our <span className="text-amber-400 font-bold">Single Spin</span> or <span className="text-amber-400 font-bold">Party Mode</span>.
                      </p>
                  </div>
              </div>
          </Link>
        </div>
        </div>

      </div>
    </>
  );
};