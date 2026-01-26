import React from 'react';

interface ItemPhaseSectionProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}


export const ItemPhaseSection: React.FC<ItemPhaseSectionProps> = React.memo(({ title, subtitle, children }) => (
  <div className="flex flex-col md:flex-row p-3 md:p-4 transition-colors duration-500 hover:bg-white/5 border-b last:border-0 border-[#3d2b24]">
    <div className="mb-2 md:mb-0 md:w-36 md:flex-shrink-0 flex flex-row md:flex-col justify-between items-center md:items-start md:border-r border-[#3d2b24] md:mr-4 pr-4">
      <div>
        <h3 className="text-sm md:text-base font-bold uppercase tracking-[0.1em] leading-none mb-1 text-[#E19D37]">
            {title}
        </h3>
        <span className="text-[10px] text-[#6e6050] font-bold uppercase tracking-wider">{subtitle}</span>
      </div>
      <div className="md:hidden h-[1px] flex-grow ml-4 bg-[#3d2b24]"></div>
    </div>

    <div className="flex flex-wrap gap-2">
      {children}
    </div>
  </div>
));