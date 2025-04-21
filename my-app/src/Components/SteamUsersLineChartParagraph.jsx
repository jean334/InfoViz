import "./StackedHistogramParagraph.css";

const SteamUsersLineChartParagraph = () => {
    return (
      <div className="stacked-par">
        <h2>Steam Popularity Over Time</h2>
  
        <p>
          This plot highlights the <strong>popularity of Steam</strong> as a game marketplace. 
          Thanks to <strong>SteamDB</strong>, user data is easily retrievable — unlike for other platforms like Epic Games, Origin, or Instant Gaming.
        </p> 
        <h3>Design Choices</h3>
        <ul>
          <li>The <strong>Y-axis</strong> represents the <strong>number of users</strong>.</li>
          <li>The <strong>X-axis</strong> represents <strong>time</strong>.</li>
          <li>A <strong>tooltip</strong> reveals more detailed information when hovering over the chart.</li>
          <li><strong>Ticks</strong> make it easier to read exact user counts.</li>
          <li>The chart supports <strong>zooming and panning</strong> for in-depth exploration.</li>
          <li>The graph is <strong>animated on creation</strong>, and the animation can be replayed via a <strong>Replay</strong> button.</li>
        </ul>
      </div>
    );
  };
  
  export default SteamUsersLineChartParagraph;