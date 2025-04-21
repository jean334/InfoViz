const ScatterPlotText = () => {
    return (
      <div className="stacked-par">
        <h2>Game Price and Recommendations distribution</h2>
        <p>
          This bubble plot highlights the distribution of games according to their price and the number of recommendations.
          We can observe that most games are priced below $20, and only a few receive more than 3000 recommendations.
          The most played and recommended games were action games. However, this observation should be taken with caution,
          as the dataset used is a small sample of the full Steam library, and we assumed the predominant genre of a game is the first listed in the dataset.
        </p>
  
        <h4>Controls</h4>
        <ul>
          <li><strong>X axis:</strong> Number of recommendations (logarithmic scale, to avoid point squeezing).</li>
          <li><strong>Y axis:</strong> Game price.</li>
          <li><strong>Color:</strong> Represents the game genre.</li>
          <li><strong>Size:</strong> Proportional to the number of game owners.</li>
        </ul>
  
        <h4>Design choices</h4>
        <ul>
          <li>Bubbles appear progressively to enhance visual engagement.</li>
          <li>Side panels allow filtering by genre of interest.</li>
          <li>Bubbles react on hover, showing a tooltip with detailed information.</li>
          <li>The visualization supports pan and zoom interactions for better exploration.</li>
        </ul>
      </div>
    );
  };
  
  export default ScatterPlotText;