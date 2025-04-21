import React from "react";
import "./StackedHistogramParagraph.css";

const EngineCountHistogramParagraph = () => {
    return (
      <div className="stacked-par">
        <h2>Engine Usage Histogram</h2>
  
        <p>
          This histogram represents either the <strong>number of games</strong> or the <strong>percentage of games</strong> developed with each game engine.
        </p>
        <p>
          This visualization allows developers to identify <strong>popular engines</strong> for their game development.
        </p>
  
        <h3>Controls</h3>
        <ul>
          <li>A slider allows selecting the <strong>minimum number</strong> of games (or the <strong>minimum percentage</strong> over the dataset) developed with each engine.</li>
          <li>You can switch between displaying the <strong>number of games</strong> and the <strong>percentage of games</strong> using a toggle button.</li>
        </ul>
  
        <h3>Design Choices</h3>
        <ul>
          <li>Bars are <strong>sorted</strong> to make comparisons easier.</li>
          <li>The histogram is fully <strong>animated</strong> for a more engaging experience, and the animation can be <strong>replayed</strong> using the replay button.</li>
          <li>Zooming is enabled on the <strong>x-axis</strong> for better exploration.</li>
          <li>The number of <strong>x-axis labels</strong> adapts depending on the number of displayed engines, preventing overlap.</li>
          <li>A <strong>tooltip</strong> provides detailed information about each engine, and bars <strong>change color</strong> when hovered for better interactivity.</li>
        </ul>
      </div>
    );
  };
  
  export default EngineCountHistogramParagraph;