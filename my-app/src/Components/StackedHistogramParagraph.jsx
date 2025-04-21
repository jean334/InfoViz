import React from "react";
import "./StackedHistogramParagraph.css";

const StackedHistogramParagraph = () => {
    return (
      <div className="stacked-par">
        <h2>Stacked Histogram Overview</h2>
        <p>
          This stacked bar chart represents the percentage of players per game engine, specifically for the selected genre. The percentage is averaged over the selected time range.
        </p>
  
        <p>
          This visualization is a powerful tool for:
        </p>
        <ul>
          <li>
            <strong>Game developers</strong>, who can assess which engine is most suitable for the type of game they want to build.
          </li>
          <li>
            <strong>Game engine creators</strong>, who gain insights into how their tools are being used in relation to game genres.
          </li>
        </ul>
  
        <h2>Controls</h2>
        <ul>
          <li>
            A <strong>double slider</strong> allows you to select a range of dates to analyze.
          </li>
          <li>
            The number of estimated players is averaged across this date range.
          </li>
          <li>
            Since the scraped dataset is only a sample of all available Steam games, we use <strong>percentage of estimated players</strong> as a metric of popularity. This allows us to measure which engine was the most popular for developing a specific genre at a given time.
          </li>
          <li>
            Another slider lets you <strong>scroll through 20 different genres</strong>.
          </li>
          <li>
            When you change the selected genre, the corresponding layer in every bar moves up or down to align on the X-axis. This makes it easier to compare the popularity of engines for a specific genre.
          </li>
        </ul>
  
        <h2>Design Choices</h2>
        <ul>
          <li>
            Bars are sorted by the percentage of players for the selected genre to ease comparison.
          </li>
          <li>
            The entire histogram is animated to make the visualization more dynamic and engaging.
          </li>
          <li>
            Initially, the different layers appear progressively. This animation can be <strong>replayed</strong> using the replay button or by adjusting the date range.
          </li>
          <li>
            The layer corresponding to the selected genre is <strong>the only one colored</strong>. Other layers are rendered in various shades of gray to emphasize the genre of interest.
          </li>
          <li>
            The grayscale tones and moving bars <strong>evoke the aesthetic of scrolling urban landscapes</strong>, a visual motif that fits well within this storyboard's theme.
          </li>
          <li>
            The chart supports <strong>zooming on the X-axis</strong> for more precise comparisons.
          </li>
          <li>
            The number of X-axis labels is dynamically adjusted based on the number of engines shown, ensuring that labels don’t overlap.
          </li>
          <li>
            A <strong>tooltip</strong> provides more detailed information when hovering over each engine.
          </li>
          <li>
            Since bars may extend beyond the chart bounds, a <strong>fade-out mask</strong> is used to gradually hide the tops and bottoms of overflowing bars, creating a smooth visual effect.
          </li>
        </ul>
      </div>
    );
  };
  
  export default StackedHistogramParagraph;
