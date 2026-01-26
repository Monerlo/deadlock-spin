import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ItemDeck from '../components/ItemDeck';
import { useHeroesPool } from '../hooks/useHeroesPool';
import { HeroCard } from '../components/HeroCard';
import { HERO_IMAGE_OVERRIDES } from '../services/deadlockApi';

export const HomePage = () => {
  const { allHeroes, loading } = useHeroesPool();
  const newHeroes = allHeroes.filter(hero => Object.keys(HERO_IMAGE_OVERRIDES).includes(hero.name));
  
  const placeholders = Array(6).fill(null);
  const showNewHeroesSection = loading || newHeroes.length > 0;

  return (
    <>
      <Helmet>
        <title>Deadlock Randomizer | Hero Picker & Item Build Generator</title>
        <meta name="description" content="The ultimate Deadlock Randomizer. Spin the wheel for random heroes, generate unique item builds, and challenge your friends in Party Mode." />
        <link rel="canonical" href="https://deadlockrandom.site/" />
      </Helmet>

      <div className="absolute inset-0 flex flex-col md:flex-row w-full bg-black overflow-hidden">
        
        
        <div className="relative group flex-1 h-[50%] md:h-auto md:w-1/2 overflow-hidden">
          <Link to="/items" className="absolute inset-0 w-full h-full block">
              
              
              <div className="absolute inset-0 bg-item bg-cover bg-center transition-all duration-1000 ease-out group-hover:scale-105 group-hover:brightness-[0.4] brightness-75 md:brightness-100" />

              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  font-black text-white/5 select-none z-0 pointer-events-none leading-none font-['Luckiest_Guy']
                  text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[14rem]"
              >
                 ITEMS
              </div>

              
              <div className="absolute z-30 pointer-events-none rotate-12
                  top-4 right-4 sm:top-8 sm:right-12 md:top-16 md:right-16"
              >
                   <span className="font-['Luckiest_Guy'] font-black text-red-500 animate-smooth-pulse text-glow-red tracking-widest drop-shadow-xl
                      text-2xl sm:text-3xl md:text-5xl"
                   >
                      NEW
                   </span>
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
                  
                  {showNewHeroesSection ? (
                    <>
                      
                      <div className="flex flex-col items-center transform transition-transform duration-500 ease-out
                          /* Mobile */
                          scale-[0.55] sm:scale-80 
                          /* Tablet (iPad): Менше, вгору, статично */
                          md:scale-[0.65] md:-translate-y-8
                          /* Desktop (LG+) */
                          lg:scale-90 lg:translate-y-0 lg:group-hover:-translate-y-16"
                      >
                        <h2 className="font-black uppercase tracking-tighter mb-2 sm:mb-4 text-[#FFEFD7] drop-shadow-lg font-['Luckiest_Guy']
                            text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center leading-none"
                        >
                            NEW HEROES
                        </h2>
                        
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                          {loading 
                            ? placeholders.map((_, index) => (
                                <div key={index} className="w-16 h-auto sm:w-20 md:w-24 aspect-[3/4] rounded-lg bg-white/10 animate-pulse border border-white/5" />
                              ))
                            : newHeroes.slice(0, 6).map((hero) => (
                                <div key={hero.id} className="w-16 h-auto sm:w-20 md:w-24 aspect-[3/4] relative transform transition-transform duration-300 hover:scale-110 hover:z-20">
                                   <HeroCard 
                                      hero={hero} 
                                      isSelected={true} 
                                      onClick={() => {}} 
                                      className="border-white/20 hover:border-[#E19D37] shadow-lg text-[8px]"
                                   />
                                </div>
                              ))
                          }
                        </div>
                      </div>

                      
                      <div className="flex flex-col items-center text-center max-w-xs sm:max-w-md
                          /* Mobile & Tablet: Абсолютно знизу, ЗАВЖДИ ВИДНО */
                          absolute bottom-4 z-30 opacity-100
                          /* Desktop (LG+): Приховано, hover */
                          lg:bottom-[15%] lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-4 lg:group-hover:translate-y-0 lg:transition-all lg:duration-500"
                      >
                          <h2 className="text-base sm:text-2xl lg:text-3xl font-black text-[#FFEFD7] font-['Luckiest_Guy'] tracking-wide drop-shadow-lg mb-0.5 md:mb-1">
                              HERO RANDOMIZER
                          </h2>
                          <p className="text-gray-200 text-[9px] sm:text-xs lg:text-sm font-['Fredoka'] leading-tight drop-shadow-md px-4 line-clamp-2 md:line-clamp-none">
                             Can't decide who to play? Use our <span className="text-amber-400 font-bold">Single Spin</span> or <span className="text-amber-400 font-bold">Party Mode</span>.
                          </p>
                      </div>
                    </>
                  ) : (
                    
                    <div className="flex flex-col items-center text-center transition-all duration-500 md:group-hover:-translate-y-4">
                      <h2 className="font-black uppercase tracking-tighter mb-2 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg font-['Luckiest_Guy']
                          text-4xl sm:text-5xl md:text-7xl"
                      >
                          HEROES
                      </h2>
                      <p className="text-gray-200 text-xs sm:text-sm lg:text-base max-w-xs sm:max-w-md leading-relaxed font-['Fredoka'] drop-shadow-md mb-4">
                         Spin the wheel and let fate decide your hero. Try Party Mode for squad randomization.
                      </p>
                      <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] border-b border-blue-400 pb-1 text-blue-300 font-bold">
                          OPEN LIST &rarr;
                      </div>
                    </div>
                  )}
              </div>
          </Link>
        </div>
      </div>
    </>
  );
};