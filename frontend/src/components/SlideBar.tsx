import React, { useState, ChangeEvent } from "react";

const ColorSlider: React.FC = () => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const getColor = (val: number): string => {
    const percent = val / 5;
    const r = Math.round(255 * (1 - percent));
    const g = Math.round(255 * percent);
    return `rgb(${r}, ${g}, 0)`;
  };

  return (
    <div style={{ padding: "20px", width: "300px" }}>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={handleChange}
        style={{
          width: "100%",
          height: "16px",
          borderRadius: "8px",
          background: "linear-gradient(to right, red, orange, yellow,green)",
          appearance: "none",
          outline: "none",
          cursor: "pointer",
        }}
      />
      {/* Custom thumb using pseudo-elements would require global CSS */}
      <div
        style={{
          marginTop: "10px",
          textAlign: "center",
          fontSize: "16px",
          color: getColor(value),
        }}
      >
        Value: {value}
      </div>
    </div>
  );
};

export default ColorSlider;
