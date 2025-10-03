import { useState, useEffect, useRef } from 'react';
import type { Hero, Priority } from '../../../types';
import { AnimationControls } from '../../../components/ui/AnimationControls';



const priorityToBorderClass = (priority: Priority | null): string => {
    if (!priority) return 'border-transparent';
    switch (priority) {
        case 3: return 'border-[#8A2BE2]'; 
        case 2: return 'border-yellow-400';   
        case 1: return 'border-[#808080]'; 
        default: return 'border-transparent';
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
    const [currentBorderClass, setCurrentBorderClass] = useState('border-transparent');
    const animationInterval = useRef<number | null>(null);
    const animationTimeout = useRef<number | null>(null);

    useEffect(() => {
        const priorities: Priority[] = [1, 2, 3];
        let speed = 75;
        let cycles = 0;

        const animate = () => {
            cycles++;
            const randomIndex = Math.floor(Math.random() * priorities.length);
            setCurrentBorderClass(priorityToBorderClass(priorities[randomIndex]));

            if (cycles > 15 && speed < 150) speed = 150;
            if (cycles > 22 && speed < 300) speed = 300;
            if (cycles > 26 && speed < 500) speed = 500;
            
            animationInterval.current = window.setTimeout(animate, speed);
        };

        animate();

        animationTimeout.current = window.setTimeout(() => {
            if (animationInterval.current) clearTimeout(animationInterval.current);
            setCurrentBorderClass(priorityToBorderClass(finalPriority));
            setTimeout(onAnimationEnd, 1000); 
        }, 4000); 

        return () => {
            if (animationInterval.current) clearTimeout(animationInterval.current);
            if (animationTimeout.current) clearTimeout(animationTimeout.current);
        };
    }, [finalPriority, onAnimationEnd]);
    
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className={`bg-[#1A1A1A] border-4 ${currentBorderClass} shadow-2xl p-6 flex flex-col items-center gap-4`}>
                 <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">{hero.name}</h2>
                 <img src={hero.images.icon_hero_card} alt={hero.name} className="w-32 h-32 sm:w-48 sm:h-48 object-cover" />
                 <p className="text-[#A0A0A0] text-base sm:text-lg">Assigning Priority...</p>
                 <AnimationControls onSkipCurrent={onSkipCurrent} onSkipAll={onSkipAll} onCancel={onCancel} />
            </div>
        </div>
    );
};

