import React from "react";

interface RotatingSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const RotatingSlider: React.FC<RotatingSliderProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const rotation = (value / 100) * 360;

  return (
    <div className="relative w-40 h-40">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        className="absolute w-full h-full opacity-0 cursor-pointer"
      />
      <div
        className="w-full h-full rounded-full border-8 border-[#1E3A8A] flex items-center justify-center"
        style={{
          background: `conic-gradient(#FF5C00 ${rotation}deg, #FFE1A1 ${rotation}deg 360deg)`,
        }}
      >
        <div className="w-3/4 h-3/4 bg-[#FDF7F0] rounded-full flex items-center justify-center">
          <div
            className="w-1 h-1/2 bg-[#1E3A8A] rounded-full origin-bottom"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>
      </div>
    </div>
  );
};
