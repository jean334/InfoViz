import React, { useState } from "react";

function DateSlider ({ minDate, maxDate, dateRange, setDateRange, className = "", label = "Date Range" }) {
  // Convertir les dates en timestamps pour le slider
  const minTimestamp = new Date(minDate).getTime();
  const maxTimestamp = new Date(maxDate).getTime();
  const startTimestamp = new Date(dateRange[0]).getTime();
  const endTimestamp = new Date(dateRange[1]).getTime();

  // Fonction pour mettre à jour la plage de dates
  const handleChange = (e, index) => {
    const newTimestamp = Number(e.target.value);
    const newDate = new Date(newTimestamp).toISOString().split("T")[0];

    const newRange = index === 0 ? [newDate, dateRange[1]] : [dateRange[0], newDate];

    if (new Date(newRange[0]) <= new Date(newRange[1])) {
      setDateRange(newRange);
    }
    if (new Date(newRange[0]) <= new Date(newRange[1])-86400000*365*2) {
        setDateRange([newRange[0], newRange[0]]);
      }
    if (new Date(newRange[0]) > new Date(newRange[1])) {
        setDateRange([newRange[0], newRange[0]]);
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="font-semibold">{label}: {dateRange[0]} → {dateRange[1]}</label>
      <div className="relative flex items-center space-x-2">
        {/* Slider Min */}
        <input
          type="range"
          min={minTimestamp}
          max={maxTimestamp}
          step={86400000} // Un jour en millisecondes
          value={startTimestamp}
          onChange={(e) => handleChange(e, 0)}
          className="w-full"
        />
        {/* Slider Max */}
        <input
          type="range"
          min={startTimestamp}
          max={startTimestamp+86400000*365} // Un an en millisecondes
          step={86400000}
          value={endTimestamp}
          onChange={(e) => handleChange(e, 1)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default DateSlider;