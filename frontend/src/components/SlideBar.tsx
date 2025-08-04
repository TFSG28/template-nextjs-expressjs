import React, { useState, ChangeEvent } from "react";

const ColorSlider: React.FC = () => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  return (
    <div className="w-[300px] px-4 py-6">
      {/* Slider Track & Gradient Layered */}
      <div className="flex flex-col items-center mb-10">
        {/* Gradient bar and slider container */}
        <div className="relative h-6 w-full mb-1">
          {/* Gradient bar */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-300 to-green-500 pointer-events-none" />

          {/* Native range slider on top */}
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={value}
            onChange={handleChange}
            className="w-full appearance-none h-2 bg-transparent relative z-10"
          />
        </div>

        {/* Ticks - now in a separate container below */}
        <div className="flex justify-between w-full px-1">
          {[0, 1, 2, 3, 4, 5].map((tick) => (
            <div
              key={tick}
              className="flex flex-col items-center"
            >
              <div className="w-px h-2 bg-gray-800"></div>
              <span className="text-xs text-gray-700 mt-1">{tick}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorSlider;
