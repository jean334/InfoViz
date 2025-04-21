import React from "react";
import "./StackedHistogramParagraph.css";

function HairballParagraph() {
  return (
    <div className="stacked-par">
      <h2>Network Graph</h2>
      <p>
        This interactive network graph offers an engaging way to explore Steam's game catalogue.
        Each <strong>node</strong> represents a game, and the <strong>color</strong> indicates its genre.
        Links are drawn between games developed by the <strong>same studio</strong>, helping to highlight clusters of productions.
      </p>
      <p>
        The visualisation is useful for both <strong>gamers</strong> and <strong>developers</strong>:
      </p>
      <ul>
        <li>Gamers can discover other popular games and track games published by their favorite studios.</li>
        <li>Developers can identify currently popular genres or follow the career path of successful studios. By observing the games they released over time (via the release date in the tooltip), developers can evaluate what type of game and level of ambition is realistic at each stage.</li>
      </ul>

      <h3>Controls</h3>
      <ul>
        <li>A <strong>double slider</strong> allows selecting a date range to filter the games displayed.</li>
        <li>A <strong>side panel</strong> filters which genres to display.</li>
        <li>Two sliders let you control the <strong>intra-link</strong> and <strong>inter-link</strong> density to avoid visual clutter or performance lag.</li>
        <li>The visualisation can be <strong>zoomed and panned</strong> for better exploration.</li>
        <li>Each node is <strong>hoverable</strong> to display additional details (game title, genre, release date, studio, etc.).</li>
        <li>Nodes can be <strong>grabbed and moved</strong> manually for custom layouting.</li>
      </ul>

      <h3>Design choices</h3>
      <ul>
        <li>The "hairball" shape of the network resembles a <strong>game map</strong>, reinforcing the ludic aspect of this storyboard.</li>
        <li>The <strong>simulation-based layout</strong> of this force-directed graph echoes the physical simulations in game engines, making the choice of this design coherent with the theme.</li>
      </ul>
    </div>
  );
}
  
  export default HairballParagraph;
