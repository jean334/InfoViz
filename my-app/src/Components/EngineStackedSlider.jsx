function EngineStackedSlider({count, genre, setCount, className, htmlFor, label, maxValue}) {
    return (
      <div className={className}>
        <input
          type="range"
          id={htmlFor}
          name={label}
          min="0"
          max={maxValue}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          step="1" />
        <label htmlFor={htmlFor}>{label}: {genre}</label>
      </div>
    );
  }
  
  export default EngineStackedSlider;  