function Slider({nbLink, setNbLink, className, htmlFor, label}) {
  return (
    <div className={className}>
      <input
        type="range"
        id={htmlFor}
        name={label}
        min="0"
        max="0.5"
        value={nbLink}
        onChange={(e) => setNbLink(Number(e.target.value))}
        step="0.02" />
      <label htmlFor={htmlFor}>{label}: {nbLink*100}%</label>
    </div>
  );
}

export default Slider;  