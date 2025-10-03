interface AnimationControlsProps {
  onSkipCurrent: () => void;
  onSkipAll: () => void;
  onCancel: () => void;
}

export const AnimationControls = ({ onSkipCurrent, onSkipAll, onCancel }: AnimationControlsProps) => (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button
            onClick={onSkipCurrent}
            className="bg-transparent border border-[#A0A0A0] text-[#A0A0A0] hover:bg-[#2D2D2D] font-semibold py-2 px-5 transition-colors text-sm"
        >
            Skip
        </button>
        <button
            onClick={onSkipAll}
            className="bg-transparent border border-[#A0A0A0] text-[#A0A0A0] hover:bg-[#2D2D2D] font-semibold py-2 px-5 transition-colors text-sm"
        >
            Skip to End
        </button>
        <button
            onClick={onCancel}
            className="bg-[#6b2121] border border-[#a33232] text-white hover:bg-[#8f2c2c] font-semibold py-2 px-5 transition-colors text-sm"
        >
            Cancel
        </button>
    </div>
);