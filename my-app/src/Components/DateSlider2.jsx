import React, { useState } from "react";

function DateSlider2 ({ minDate, maxDate, dateRange, setDateRange, className = "", label = "Date Range" }) {
  // Convertir les dates en timestamps pour le slider
  const minTimestamp = new Date(minDate).getTime();
  const maxTimestamp = new Date(maxDate).getTime();
  const startTimestamp = new Date(dateRange[0]).getTime();
  const endTimestamp = new Date(dateRange[1]).getTime();

  // Fonction pour mettre à jour la plage de dates
  const handleChange = (e, index) => {
    const newDate = Number(e.target.value);
    const newRange = index === 0 ? [newDate, dateRange[1]] : [dateRange[0], newDate];

    if (newRange[0] <= newRange[1]) {
      setDateRange(newRange);
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="font-semibold">{label}: {dateRange[0]+1997} → {dateRange[1]+1997}</label>
      <div className="relative flex items-center space-x-2">
        {/* Slider Min */}
        <input
          type="range"
          min={0}
          max={28}
          step={1} // 1 year
          value={0}
          onChange={(e) => handleChange(e, 0)}
          className="w-full"
        />
        {/* Slider Max */}
        <input
          type="range"
          min={1}
          max={28} // 1 year
          step={1}
          value={20}
          onChange={(e) => handleChange(e, 1)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default DateSlider2;