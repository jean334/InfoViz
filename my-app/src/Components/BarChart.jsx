import { useEffect, useState } from "react";
import * as d3 from "d3";
import data from "../assets/barChart.json";
import BarDoubleSlider from "./BarDoubleSlider";
import ToggleButtons from "./ToggleButton.jsx";
import "./BarChart.css";

function BarPlot({ selectedGroups }) {
  if (!data) return <p>Loading viz...</p>;

  return <GraphVisualization data={data} selectedGroups={selectedGroups} />;
}

function getGradientUrl(category) {
  return `url(#gradient_${category})`;
}

function GraphVisualization({ data, selectedGroups }) {
  const [dateRange, setDateRange] = useState([0, 28]);
  const [selected, setSelected] = useState(1);
  const categoryColors = {
    Sports: ["#FF5733", "#FF8D33"],
    Action: ["#d62828", "#f77f00"], 
    Education: ["#540b0e", "#9e2a2b"],
    Early_Access: ["#3357FF", "#338DFF"],
    Adventure: ["#22223b", "#4a4e69"],
    Simulation: ["#ff9f1c", "#ffbf69"],
    RPG: ["#99582a", "#ffe6a7"],
    Racing: ["#33FF57", "#33FF8D"],
    Design_and_Illustration: ["#3357FF", "#338DFF"],
    Utilities: ["#FF33A1", "#FF33D4"],
    Tactical: ["#FF5733", "#FF8D33"],
    Indie: ["#3a0ca3", "#560bad"],
    Video_Production: ["#656d4a", "#a4ac86"],
    Strategy: ["#3357FF", "#338DFF"],
    Free_to_Play: ["#52796f", "#84a98c"],
    Violent: ["#FF5733", "#FF8D33"],
    Massively_Multiplayer: ["#1b263b", "#415a77"],
    Animation_and_Modeling: ["#84a59d", "#f5cac3"],
    Shooter: ["#3357FF", "#338DFF"],
    Casual: ["#3a5a40", "#588157"],
    Fighting: ["#FF5733", "#FF8D33"],
};

  useEffect(() => {
    d3.select("#bar-container").select("svg").remove();

    const width = 1800;
    const height = data.length * 30;
    const marginTop = 20;
    const marginRight = 70;
    const marginBottom = 30;
    const marginLeft = 90;
    //const color = d3.scaleOrdinal(d3.schemeCategory10);

    function createGradients(svg) {
      const defs = svg.append("defs");
  
      Object.entries(categoryColors).forEach(([category, [startColor, endColor]]) => {
          const gradient = defs.append("linearGradient")
              .attr("id", `gradient_${category}`)
              .attr("x1", "0%")
              .attr("y1", "0%")
              .attr("x2", "100%")
              .attr("y2", "50%");
  
          gradient.append("stop")
              .attr("offset", "0%")
              .attr("stop-color", startColor);
  
          gradient.append("stop")
              .attr("offset", "100%")
              .attr("stop-color", endColor);
      });
  }

  

    const filteredData = data;
    const xScale = d3.scaleLinear().range([0, width]);

    const computeGenreRatios = (filteredData) => {
      return filteredData.map(({ genre, nb_game, nb_hour_played }) => {
        const ratio = nb_game.map((gameCount, i) => {
          const hours = nb_hour_played[i];
          return gameCount === 0 ? 0 : hours / gameCount;
        });
    
        return { genre, ratio };
      });
    };

    const ratio = computeGenreRatios(filteredData);

    console.log("ratio", ratio);
    console.log("filteredData", filteredData);


    //const xScale = d3.scaleLinear()
    if (selected === 1) {
      xScale.domain([0, d3.max(filteredData, d => d3.sum(d.nb_game.slice(dateRange[0], dateRange[1])))])
      .range([0, width]);
    } else {
      xScale.domain([0, d3.max(ratio, d => d3.mean(d.ratio.slice(dateRange[0], dateRange[1])) )])
      .range([0, width]);
    }

    const yScale = d3.scaleBand()
      .domain(filteredData.map(d => d.genre))
      .range([0, height])
      .padding(0.2);

    const svg = d3.select("#bar-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width+marginLeft+marginRight, height+marginTop+marginBottom])
      .style("max-width", "100%")
      .style("height", "auto")
      .style("border", "1px solid #333533")
      .style("border-radius", "8px");

      createGradients(svg); 
    const g = svg.append("g");

    
    const zoom = d3.zoom()
        .scaleExtent([0.5, 5]) 
        .on("zoom", (event) => {
        g.attr("transform", event.transform);
        });

        //svg.call(zoom); 
    
    if (selected === 1) {
    g.selectAll("rect")
      .data(filteredData, d => d.genre)
      .join(
        enter => enter.append("rect")
          .attr("x", 0)
          .attr("y", d => yScale(d.genre))
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("height", yScale.bandwidth())
          .attr("width", 0) 
          .attr("fill", d => getGradientUrl(d.genre))
          .transition()
          .duration(500)
          .attr("width", d =>xScale(d3.sum(d.nb_game.slice(dateRange[0], dateRange[1])))),
        update => update
          .transition()
          .duration(500)
          .attr("y", d => yScale(d.genre))
          .attr("width", d => xScale(d3.sum(d.nb_game.slice(dateRange[0], dateRange[1])))),
        exit => exit
          .transition()
          .duration(300)
          .attr("width", 0)
          .remove()
      );
    } else {
      g.selectAll("rect")
      .data(ratio, d => d.genre)
      .join(
        enter => enter.append("rect")
          .attr("x", 0)
          .attr("y", d => yScale(d.genre))
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("height", yScale.bandwidth())
          .attr("width", 0) 
          .attr("fill", d => getGradientUrl(d.genre))
          .transition()
          .duration(500)
          .attr("width", d =>xScale(d3.mean(d.ratio.slice(dateRange[0], dateRange[1])))),
        update => update
          .transition()
          .duration(500)
          .attr("y", d => yScale(d.genre))
          .attr("width", d => xScale(d3.mean(d.ratio.slice(dateRange[0], dateRange[1])))),
        exit => exit
          .transition()
          .duration(300)
          .attr("width", 0)
          .remove()
      );
    }

    if (selected === 1) {
    g.selectAll("text")
      .data(filteredData, d => d.genre)
      .join(
        enter => enter.append("text")
          .attr("x", 5)
          .attr("y", d => yScale(d.genre) + yScale.bandwidth() / 2)
          .attr("dy", "0.35em")
          .text(d => `${d.genre}: ${Math.round(d3.sum(d.nb_game.slice(dateRange[0], dateRange[1])))}`)
          .style("fill", "white"),
        update => update
          .transition()
          .duration(500)
          .attr("y", d => yScale(d.genre) + yScale.bandwidth() / 2)
          .text(d => `${d.genre}: ${d3.sum(d.nb_game.slice(dateRange[0], dateRange[1])) }`),
        exit => exit
          .transition()
          .duration(300)
          .style("opacity", 0)
          .remove()
      );
    }
    else{
      g.selectAll("text")
      .data(ratio, d => d.genre)
      .join(
        enter => enter.append("text")
          .attr("x", 5)
          .attr("y", d => yScale(d.genre) + yScale.bandwidth() / 2)
          .attr("dy", "0.35em")
          .text(d => `${d.genre}: ${Math.round(d3.mean(d.ratio.slice(dateRange[0], dateRange[1])))}`)
          .style("fill", "white"),
        update => update
          .transition()
          .duration(500)
          .attr("y", d => yScale(d.genre) + yScale.bandwidth() / 2)
          .text(d => `${d.genre}: ${d3.mean(d.ratio.slice(dateRange[0], dateRange[1])) }`),
        exit => exit
          .transition()
          .duration(300)
          .style("opacity", 0)
          .remove()
      );
    }

  }, [data, dateRange, selected]);

  return (
    <div id="bar-container">
      <div className="controller-container2">  
        <div className="slider-container2">
          <BarDoubleSlider props={{ dateRange: dateRange, setDateRange: setDateRange }} />
        </div>
        <div className="toggle-container2">
          <ToggleButtons props={{ setSelected: setSelected, selected: selected }} />
        </div>
      </div>
    </div>
  );
}

export default BarPlot;