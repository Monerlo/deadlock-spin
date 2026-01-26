import { useLocation } from 'react-router-dom';

export const DynamicBackground = () => {
  const location = useLocation();
  const path = location.pathname;

  let bgImage = null;

  
  if (path.includes('heroes')) {
    bgImage = "url('/bg-hero.jpg')";
  } else if (path.includes('items')) {
    bgImage = "url('/bg-item.jpg')";
  } else if (path === '/') {
    
    bgImage = "url('/bg-main.jpg')";
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      
      <div className="absolute inset-0 bg-[#1A1A1A]"></div>

      
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${bgImage ? 'opacity-30' : 'opacity-0'}`}
        style={{ 
          backgroundImage: bgImage || 'none' 
        }}
      ></div>
    </div>
  );
};