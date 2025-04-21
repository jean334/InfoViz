function EngineHistogramSlider({count, setCount, className, htmlFor, label, maxValue}) {
    return (
      <div className={className}>
        <input
          type="range"
          id={htmlFor}
          name={label}
          min="0"
          max={maxValue/2}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          step="1" />
        <label htmlFor={htmlFor}>{label}: {count}</label>
      </div>
    );
  }
  
  export default EngineHistogramSlider;  