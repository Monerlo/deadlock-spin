import { Link, Outlet, useLocation } from 'react-router-dom';
import { DynamicBackground } from '../components/DynamicBackground';
import { useState } from 'react';

export const MainLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/heroes', label: 'HEROES' },
    { path: '/items', label: 'ITEMS' }
  ];

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen w-full font-sans flex flex-col text-white relative overflow-x-hidden">
      <DynamicBackground />

      
      <nav className="sticky top-0 z-50 w-full border-b border-[#E19D37]/30 bg-[#120b09]/95 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            
            
            <Link 
              to="/" 
              className="flex items-center gap-3 group relative z-10" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
               <img 
                 src="/logo.svg" 
                 alt="Deadlock Randomizer Logo" 
                 className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-md transition-transform group-hover:scale-105" 
               />
               
               <div className="flex flex-col leading-none justify-center">
                 <span className="font-['Fredoka'] font-bold text-[#E19D37] text-xl sm:text-2xl tracking-wide drop-shadow-sm group-hover:text-white transition-colors">
                    DEADLOCK
                 </span>
                 <span className="font-['Fredoka'] text-[#A0A0A0] text-[10px] sm:text-xs font-semibold tracking-[0.2em] group-hover:text-[#E19D37] transition-colors">
                    RANDOMIZER
                 </span>
               </div>
            </Link>

            
            <div className="hidden md:flex items-center gap-6">
               {navLinks.map((link) => (
                 <Link 
                   key={link.path}
                   to={link.path}
                   className={`
                     relative font-['Fredoka'] font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105
                     ${isActive(link.path) 
                       ? 'text-[#E19D37]' 
                       : 'text-[#A0A0A0] hover:text-white'
                     }
                   `}
                 >
                   {link.label}
                   
                   {isActive(link.path) && (
                     <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E19D37] rounded-full"></span>
                   )}
                 </Link>
               ))}
            </div>

            
            <div className="md:hidden flex items-center z-10">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#E19D37] p-2 focus:outline-none hover:bg-white/5 rounded-md transition-colors"
              >
                <div className="w-6 h-5 flex flex-col justify-between relative">
                  <span className={`h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'w-6 rotate-45 translate-y-2.5' : 'w-6'}`} />
                  <span className={`h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : 'w-4 ml-auto'}`} />
                  <span className={`h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        
        <div className={`md:hidden absolute top-full left-0 w-full bg-[#120b09] border-b border-[#E19D37]/20 shadow-2xl transition-all duration-300 origin-top overflow-hidden ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
           <div className="flex flex-col p-4 gap-2">
             {navLinks.map((link) => (
                 <Link 
                   key={link.path}
                   to={link.path}
                   onClick={() => setIsMobileMenuOpen(false)}
                   className={`
                     px-4 py-3 rounded-lg font-['Fredoka'] font-bold text-sm tracking-widest uppercase transition-all
                     ${isActive(link.path) 
                       ? 'text-[#E19D37] bg-white/5' 
                       : 'text-[#A0A0A0] hover:text-white hover:bg-white/5'
                     }
                   `}
                 >
                   {link.label}
                 </Link>
               ))}
           </div>
        </div>
      </nav>

      
      <div className="flex-grow w-full relative z-10 flex flex-col">
        <div className="flex-1 relative w-full"> 
            <Outlet />
        </div>
      </div>

      
      <footer className="w-full relative z-20 bg-[#0e0806] border-t border-[#3d2b24]">
        <div className="max-w-7xl mx-auto py-6 px-4 flex flex-col md:flex-row justify-between items-center gap-4">
           
           <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
                <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity select-none">
                    <img src="/logo.svg" alt="Footer Logo" className="w-6 h-6 grayscale opacity-50" />
                    <span className="font-['Fredoka'] font-bold text-[#E19D37] text-lg tracking-wide">DEADLOCK</span>
                    <span className="text-[#808080] text-xs font-bold tracking-wider">FAN TOOL</span>
                </div>
                
                
                <span className="text-[#505050] text-[10px] md:text-xs font-mono">
                    Powered by <a href="https://deadlock-api.com/" target="_blank" rel="noopener noreferrer" className="text-[#808080] hover:text-[#E19D37] transition-colors underline decoration-dotted">deadlock-api.com</a>
                </span>
           </div>

           <div className="flex flex-col items-center md:items-end gap-1">
               <div className="flex items-center gap-1 text-[#808080] text-xs">
                  <span>Dev by</span>
                  <span className="text-[#E19D37] font-bold">Bananak</span>
               </div>
               <p className="text-[#505050] text-[10px] font-mono text-center md:text-right">
                  Not affiliated with Valve Software.
               </p>
           </div>

        </div>
      </footer>
    </div>
  );
};