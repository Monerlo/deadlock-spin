import { useState, useEffect, useRef } from 'react';
import type { Hero, Priority } from '../../../types';
import { AnimationControls } from '../../../components/ui/AnimationControls';


const getFinalBorderClass = (priority: Priority): string => {
    switch (priority) {
        case 3: return 'border-[#8A2BE2] shadow-[0_0_30px_rgba(138,43,226,0.3)]';
        case 2: return 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]'; 
        case 1: return 'border-[#808080] shadow-[0_0_30px_rgba(128,128,128,0.3)]';
        default: return 'border-[#3d2b24]';
    }
}

interface PrioritySpinModalProps {
    hero: Hero;
    finalPriority: Priority;
    onAnimationEnd: () => void;
    onSkipCurrent: () => void;
    onSkipAll: () => void;
    onCancel: () => void;
}

export const PrioritySpinModal = ({ hero, finalPriority, onAnimationEnd, onSkipCurrent, onSkipAll, onCancel }: PrioritySpinModalProps) => {
    const [isFinished, setIsFinished] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        
        timeoutRef.current = window.setTimeout(() => {
            setIsFinished(true);
            
            setTimeout(onAnimationEnd, 1000); 
        }, 3000); 

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [onAnimationEnd]);
    
    
    const borderClass = isFinished 
        ? getFinalBorderClass(finalPriority) 
        : 'border-4 animate-priority-spin'; 

    return (
        
        <div className="fixed inset-0 bg-[#000000]/95 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            
            <div className={`relative bg-[#1a110e] border-4 ${borderClass} rounded-xl p-8 flex flex-col items-center gap-6 max-w-md w-full transition-all duration-300`}>
                 
                 
                 <h2 className="text-3xl sm:text-4xl font-bold text-[#E19D37] text-center uppercase tracking-widest drop-shadow-md z-10">
                    {hero.name}
                 </h2>

                
                 <div className="relative group">
                    
                    <div className="absolute -inset-1 bg-[#E19D37]/10 rounded-lg"></div>
                    <img 
                        src={hero.images.icon_hero_card || ''} 
                        alt={hero.name} 
                        className="relative w-40 h-40 sm:w-56 sm:h-56 object-cover rounded-lg border-2 border-[#3d2b24] shadow-xl z-10" 
                    />
                 </div>

                
                 <div className="text-center z-10">
                     <p className="text-[#A0A0A0] text-sm uppercase tracking-wider font-bold mb-1">Priority Level</p>
                     <p className={`text-2xl font-black ${isFinished ? 'text-white scale-110' : 'text-[#6e6050]'} transition-all duration-300`}>
                        {isFinished ? `TIER ${finalPriority}` : 'CALCULATING...'}
                     </p>
                 </div>

                 <div className="z-10 w-full flex justify-center mt-2">
                    <AnimationControls onSkipCurrent={onSkipCurrent} onSkipAll={onSkipAll} onCancel={onCancel} />
                 </div>
            </div>
        </div>
    );
};