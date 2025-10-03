import React from 'react';

interface CustomNumberInputProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
}

export function CustomNumberInput({ label, value, onChange, min, max, disabled = false }: CustomNumberInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const rawValue = e.target.value;
    if (rawValue === '') {
      onChange(min);
      return;
    }
    let numValue = parseInt(rawValue, 10);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange(clampedValue);
    }
  };

  return (
    <div className={`flex flex-col items-start gap-2 ${disabled ? 'opacity-50' : ''}`}>
      <label className="text-[#A0A0A0] font-semibold text-lg">{label}</label>
      <div className="w-44 h-14 bg-[#1A1A1A] border-2 border-[#2D2D2D] p-1">
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          disabled={disabled}
          className="w-full h-full bg-transparent text-center text-white font-mono text-3xl outline-none appearance-textfield 
                     [&::-webkit-outer-spin-button]:h-full [&::-webkit-outer-spin-button]:opacity-50
                     [&::-webkit-inner-spin-button]:h-full [&::-webkit-inner-spin-button]:opacity-50"
        />
      </div>
    </div>
  );
};