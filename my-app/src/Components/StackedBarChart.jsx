import { useEffect, useState } from "react";
import * as d3 from "d3";
import data from "../assets/bar1.json";
import DateSlider2 from "./DateSlider2";
import "./StackedBarChart.css";

function StackedBarPlot({ selectedGroups }) {
    const [data, setData] = useState(null);
    useEffect(() => {
      d3.dsv(",", "/assets/stacked_1.csv", (d) => ({
        group: d.group,
        Nitrogen: +d.Nitrogen,
        normal: +d.normal,
        stress: +d.stress,
      })).then((loadedData) => {
        setData(loadedData);
      });
    }, []);
  
    if (!data) return <p>Loading viz...</p>;
  
    return <GraphVisualization data={data} selectedGroups={selectedGroups}/>;
  }

  function GraphVisualization({ data, selectedGroups }) {
    const width = 1200;
    const height = 800;
    const marginTop = 20;
    const marginRight = 70;
    const marginBottom = 30;
    const marginLeft = 40;
    const barRadius = 10; 
    const [replay, setReplay] = useState(false); 

    const replayAnimation = () => {
        setReplay(false);
        setTimeout(() => setReplay(true), 0); 
      };

    useEffect(() => {
        d3.select("#stacked-container").select("svg").remove();

        const svg = d3.select("#stacked-container")
            .append("svg")
            .attr("width", width + marginLeft + marginRight)
            .attr("height", height + marginTop + marginBottom)
            .attr("viewBox", [0, 0, width + marginLeft + marginRight, height + marginTop + marginBottom])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
            .append("g")
            .attr("transform", `translate(${marginLeft},${marginTop})`);

        const subgroups = data.columns.slice(1);

        const groups = data.map(d => d.group);

        const x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => {
                return d3.sum(subgroups, key => +d[key]);
            })])
            .nice()
            .range([height, 0]);

        const xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        xAxis.select("path.domain")
            .attr("stroke-dasharray", width) 
            .attr("stroke-dashoffset", width) 
            .transition()
            .duration(800)
            .delay(1000)
            .ease(d3.easeCubic)
            .attr("stroke-dashoffset", 0);


        xAxis
            .call(g => g.append("text")
                .attr("x", width-40)
                .attr("y", 5)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("Number of recommendations"))
                .attr("font-size", 2)
                .attr("opacity", 0)
                .transition()
                .delay(1500) 
                .duration(800)
                .ease(d3.easeElastic)
                .delay((d, i) => Math.random() * 1000)
                .attr("font-size", 15)
                .attr('opacity', 1)
                .attr("font-weight", "bold"); 
        


        const yAxis = svg.append("g")
            //.attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(height / 40));
        

        yAxis.select("path.domain")
            .attr("stroke-dasharray", height)
            .attr("stroke-dashoffset", height)
            .transition()
            .duration(2500)
            .delay(1500)
            .ease(d3.easeCubic)
            .attr("stroke-dashoffset", 0);
            
        yAxis
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("Price of the game (in $)"))
                .attr("font-size", 2)
                .attr("opacity", 0)
                .transition()
                .delay(1500) 
                .duration(800)
                .ease(d3.easeElastic)
                .delay((d, i) => Math.random() * 1000)
                .attr("font-size", 15)
                .attr('opacity', 1)
                .attr("font-weight", "bold"); 

        const categoryColors = {
            "Nitrogen": ["#ff4d4d", "#ff9999"],    // red tones
            "normal": ["#4da6ff", "#99ccff"],     // blue tones
            "stress": ["#66cc66", "#b3e6b3"], // green tones
            "RPG": ["#cc99ff", "#e6ccff"],       // purple tones
            "Strategy": ["#ffa64d", "#ffd1a3"],  // orange tones
            "Simulation": ["#ffff66", "#ffffb3"],// yellow tones
            "Sports": ["#00e6e6", "#b3ffff"],    // cyan tones
            "Puzzle": ["#e6e600", "#ffff66"],    // yellow-green
            "Racing": ["#ff8533", "#ffbb99"],    // warm orange
            "Shooter": ["#990000", "#ff6666"]    // dark red
        };
            
        function createGradients(svg) {
            const defs = svg.append("defs");
        
            Object.entries(categoryColors).forEach(([category, [startColor, endColor]]) => {
                const gradient = defs.append("linearGradient")
                    .attr("id", `gradient_${category}`)
                    .attr("x1", "0%")
                    .attr("y1", "100%")
                    .attr("x2", "50%")
                    .attr("y2", "0%");
        
                gradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", startColor);
        
                gradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", endColor);
            });
        }
        
        // Use this to get the fill style
        function getGradientUrl(category) {
            return `url(#gradient_${category})`;
        }

        createGradients(svg); 

        // Axes
        /*
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));

        svg.append("g")
            .call(d3.axisLeft(y));
        */

        // Stack the data
        console.log("subgroups", subgroups);
        const stackedData = d3.stack()
            .keys(subgroups)(data);

        console.log("stackedData", stackedData);

        stackedData.forEach((layer, layerIndex) => {
            svg.append("g")
                .attr("fill", getGradientUrl(layer.key))
                .selectAll("rect")
                .data(layer)
                .join("rect")
                .attr("x", d => x(d.data.group))
                .attr("y", y(0)) // départ depuis le bas (zéro)
                .attr("rx", barRadius)
                .attr("ry", barRadius)
                .attr("height", 0)
                .attr("width", x.bandwidth())
                .transition()
                .delay((d, i) => 500 * layerIndex + Math.random() * 300 + 1500)
                .duration(800)
                .attr("y", d => y(d[1]))
                .attr("height", d => y(d[0]) - y(d[1]))
                .ease(d3.easeBackOut);
        });

    }, [data, replay, selectedGroups]);

    return (
        <div>
        <button onClick={replayAnimation} className="replay-button">Replay</button> 
        <div id="stacked-container" className="stacked-container"></div>
        </div>
    );
}

export default StackedBarPlot;