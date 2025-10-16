import React, { useState, useEffect } from 'react';

interface CustomNumberInputProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
}

export function CustomNumberInput({ label, value, onChange, min, max, disabled = false }: CustomNumberInputProps) {

    const [inputValue, setInputValue] = useState(value.toString());


    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);


        if (val === '') {
            return;
        }


        const num = parseInt(val, 10);
        if (!isNaN(num) && num >= min && num <= max) {
            onChange(num);
        }
    };

    const handleBlur = () => {
        const val = inputValue.trim();
        let num = parseInt(val, 10);


        if (val === '' || isNaN(num)) {
            onChange(min);
        } else {

            const clampedNum = Math.max(min, Math.min(max, num));
            onChange(clampedNum);
        }

    };
    
    const increment = () => {
        onChange(Math.min(max, value + 1));
    };

    const decrement = () => {
        onChange(Math.max(min, value - 1));
    };

    return (
        <div className={`flex flex-col items-start gap-2 ${disabled ? 'opacity-50' : ''}`}>
            <label className="text-[#A0A0A0] font-semibold text-lg">{label}</label>
            <div className="flex items-center w-44 h-14 bg-[#1A1A1A] border-2 border-[#2D2D2D]">
                <button
                    onClick={decrement}
                    disabled={disabled || value <= min}
                    className="px-4 h-full text-white text-3xl hover:bg-[#2D2D2D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrement"
                >
                    -
                </button>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={inputValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                    className="w-full h-full bg-transparent text-center text-white font-mono text-3xl outline-none"
                />
                <button
                    onClick={increment}
                    disabled={disabled || value >= max}
                    className="px-4 h-full text-white text-3xl hover:bg-[#2D2D2D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increment"
                >
                    +
                </button>
            </div>
        </div>
    );
}
