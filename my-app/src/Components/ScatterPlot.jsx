import { useEffect, useState } from "react";
import * as d3 from "d3";


function ScatterPlot({ selectedGroups }) {
    const [data, setData] = useState(null);
    useEffect(() => {
      d3.dsv(",", "/assets/bubblePlot.csv", (d) => ({
        name: d.name,
        owners: +d.owners,
        price: +d.price,
        score: +d.score,
        positive: +d.positive,
        negative: +d.negative,
        recommendations: +d.recommendations,
        playtime: +d.playtime,
        genre: d.genres.split(",").map((g) => g.trim())[0],
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
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    useEffect(() => {

    d3.select("#scatter-container").select("svg").remove(); 

    const filteredData = data.filter(d => selectedGroups.has(d.genre));
    const svg = d3.select("#scatter-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width+marginLeft+170, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const g = svg.append("g");

        const zoom = d3.zoom()
        .scaleExtent([0.5, 5]) 
        .on("zoom", (event) => {
        g.attr("transform", event.transform); 
        });

    svg.call(zoom); 


    // Add X axis
    const x = d3.scaleLog([30, d3.max(filteredData, d => d.recommendations+5)], [marginLeft, width - marginRight]);

    // Add Y axis
    const y = d3.scaleLinear([0, d3.max(filteredData, d => d.price+2)], [height - marginBottom, marginTop]);

    const maxOwners = d3.max(filteredData, d => d.owners);

    const xAxis = g.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
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
    


    const yAxis = g.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
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
            .delay((d, i) => Math.random() * 100)
            .attr("font-size", 15)
            .attr('opacity', 1)
            .attr("font-weight", "bold"); 

    const categoryColors = {
        "Action": ["#ff4d4d", "#ff9999"],    // red tones
        "Indie": ["#4da6ff", "#99ccff"],     // blue tones
        "Adventure": ["#66cc66", "#b3e6b3"], // green tones
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

    function getGradientUrl(category) {
        return `url(#gradient_${category})`;
    }

    createGradients(svg); 

    // Add dots
    const node = g.append('g')
    .selectAll("circle")
    .data(filteredData)
    .join("circle")
        .attr("cx", d => x(d.recommendations))
        .attr("cy", d => y(d.price))
        .attr("r", 0)
        .attr("opacity", 0)
        .attr("fill", d => getGradientUrl(d.genre));

    node.transition()
        .duration(800)
        .delay((d, i) => i * 10 + 1500)
        .attr("opacity", 1)
        .ease(d3.easeElastic)
        .attr("r", d => (d.owners / maxOwners) * 10 + 5);

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#333")
        .style("color", "white")
        .style("padding", "5px 10px")
        .style("border-radius", "5px")
        .style("display", "none")
        .style("pointer-events", "none");

    node.on("mouseover", function (event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .ease(d3.easeElastic)
            .attr("r", (d.owners / maxOwners) * 10 * 1.5 + 5* 1.5);

    tooltip.style("display", "block")
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 10}px`)
        .text(`${d.name} : ${d.price}$ | ${d.recommendations} | ${d.owners} owners | median playtime : ${d.playtime}h`);
})
.on("mouseout", function (event, d) {
    d3.select(this)
        .transition()
        .duration(200)
        .attr("r", (d.owners / maxOwners) * 10 + 5);

    tooltip.style("display", "none");
});
  
    /*
    svg.append('g')
        .selectAll("text")
        .data(data)
        .join("text")
            .text(d => d.name) 
            .attr("x", d => x(d.recommendations))
            .attr("y", d => y(d.price) - d.price*5 - 5) 
            .attr("text-anchor", "middle")
            .attr("fill", "white") 
            .attr("font-size", "15px")
            .attr("font-weight", "bold")
            .attr("opacity", 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 600 + 2000) 
            .attr("opacity", 1);


    svg.append('g')
    .selectAll("text")
    .data(data)
    .join("text")
        .text(d => d.size + " viz") 
        .attr("x", d => x(d.recommendations))
        .attr("y", d => y(d.price)+6) 
        .attr("text-anchor", "middle")
        .attr("fill", "#333") 
        .attr("font-size", "12px")
        //.attr("font-weight", "bold")
        .attr("opacity", 0)
        .transition()
        .duration(800)
        .delay((d, i) => i * 600 + 2000) 
        .attr("opacity", 1);

        */
    const legend = svg.append("g")
    
    //const uniqueGroups = ['Indie', 'Action', 'Adventure', 'Casual', 'Simulation', 'Strategy', 'RPG', 'Sports', 'Massively Multiplayer', 'Racing', 'Puzzle', 'Platformer', 'Early Access', 'Free to Play', 'VR']
    const uniqueGroups = [...new Set(filteredData.map(d => d.genre))];
    uniqueGroups.forEach((group, i) => {
        const legendRow = legend.append("g")

        .attr("transform", `translate(${width-marginRight/2}, ${i*50 + 200})`);

        legendRow.append("rect")
        .attr("width", 0)
        .attr("height", 0)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", () => getGradientUrl(group))
        .attr("opacity", 0)
        .transition()
        .duration(800)
        .attr("width", 20)
        .attr("height", 20)
        .delay((d, i) => i * 600 + 2000)
        .attr("opacity", 1)
        .ease(d3.easeCubic);
    
        legendRow.append("text")
        .attr("x", 10)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
        .attr("fill", "#E8EDDF")
        .attr("font-weight", "bold")
        .text(group)
        .attr("opacity", 0)
        .transition()
        .duration(800)
        .delay((d, i) => i * 600 + 2000)
        .attr("opacity", 1);
        });
        
      }, [selectedGroups]); 
      return <div id="scatter-container"></div>;
      }


export default ScatterPlot;