import * as d3 from "d3";
import { useState, useEffect } from "react";

function Histogram() {
    const [data, setData] = useState(null);
  
    useEffect(() => {
      d3.dsv(",", "/assets/hist4.csv", (d) => ({
        week: d.week.slice(0, 10),
        count: +d.count,
      })).then((loadedData) => {
        setData(loadedData);
      });
    }, []);
  
    if (!data) return <p>Loading viz...</p>;
  
    return <GraphVisualization data={data} />;
  }
  
function GraphVisualization({data}){
  
    const width = window.innerWidth ;
    const height = 500;
    const marginTop = 20;
    const marginRight = 0;
    const marginBottom = 50;
    const marginLeft = 40;

//  useEffect(() => {
    d3.select("#hist-container").select("svg").remove(); 
    const x = d3.scaleBand()
        .domain(data.map(d => d.week))
        .range([marginLeft, width - marginRight])
        .padding(0.1);

    const tickValues = data.map(d => d.week).filter((_, i) => i % 2 === 0); 

    const xAxis = d3.axisBottom(x)
        .tickValues(tickValues) 
        .tickSizeOuter(0);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)]).nice()
        .range([height - marginBottom, marginTop]);

    const svg = d3.select("#hist-container")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto;")
        .call(zoom);

    // Append the bars.
    svg.append("g")
        .attr("class", "bars")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.week))
        .attr("y", d => y(d.count))
        .attr("height", d => y(0) - y(d.count))
        .attr("width", x.bandwidth());

    // Append the axes.
    svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis)
  .selectAll("text")  // Sélectionne tous les ticks
    .style("text-anchor", "end")  // Alignement
    .attr("dx", "-0.5em")  // Décalage horizontal (ajuste si besoin)
    .attr("dy", "-0.2em") // Décalage vertical (ajuste si besoin)
    .attr("transform", "rotate(-45)"); // Rotation à 90° vers la gauche

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove());



    function zoom(svg) {
        const extent = [[marginLeft, marginTop], [width - marginRight, height - marginTop]];

        svg.call(d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", zoomed));

        function zoomed(event) {
        x.range([marginLeft, width - marginRight].map(d => event.transform.applyX(d)));
        svg.selectAll(".bars rect").attr("x", d => x(d.week)).attr("width", x.bandwidth());
        svg.selectAll(".x-axis").call(xAxis);
        }
    }

  //}, [data]);
  return (
    <div id="hist-container">
    </div>
  );

}

export default Histogram;