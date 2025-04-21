import * as d3 from "d3";
import html2canvas from "html2canvas";
import { useState, useEffect } from "react";

function HistogramAssignment() {
    const [data, setData] = useState(null);
  
    useEffect(() => {
      d3.dsv(",", "/assets/histAssignement.csv", (d) => ({
        assignement: d.assignement,
        count: +d.hour,
      })).then((loadedData) => {
        setData(loadedData);
      });
    }, []);
  
    if (!data) return <p>Loading viz...</p>;
  
    return <GraphVisualization data={data} />;
  }
  
function GraphVisualization({data}){
  
    const width = window.innerHeight ;
    const height = window.innerWidth;
    const marginTop = 250;
    const marginRight = 0;
    const marginBottom = 50;
    const marginLeft = 40;
    const barRadius = 10; 
    const [frameCount, setFrameCount] = useState(0);


    useEffect(() => {
      d3.select("#hist-container").select("svg").remove(); // Supprime l'ancien SVG
  
      const svg = d3
        .select("#hist-container")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto;");

      svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#080807");

      // Ajouter le dégradé
      const defs = svg.append("defs");
      const gradient = defs
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "50%")
        .attr("y2", "0%");
        
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#ffafcc"); 
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#cdb4db"); 
  
      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.assignement))
        .range([marginLeft, width - marginLeft])
        .padding(0.1);
  
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.count)])
        .nice()
        .range([height - marginBottom, marginTop]);
  
      const barsGroup = svg.append("g").attr("fill", "steelblue");
      const textGroup = svg.append("g").attr("fill", "black");

      const indices = d3.shuffle(d3.range(data.length));    

      const animateBars = () => {
          indices.forEach((i, index) => {
            const d = data[i];
            setTimeout(() => {
              barsGroup
                .append("rect")
                .attr("x", x(d.assignement))
                .attr("y", y(0))
                .attr("height", 0)
                .attr("rx", barRadius) 
                .attr("ry", barRadius)
                .attr("fill", "url(#gradient)") 
                .attr("width", x.bandwidth())
                .transition()
                .duration(800)
                .attr("y", y(d.count))
                .attr("height", y(0) - y(d.count))
                .ease(d3.easeBackOut);       
        
              textGroup
                .append("text")
                .attr("x", x(d.assignement) + x.bandwidth() / 2)
                .attr("y", y(0)+20)
                .attr("text-anchor", "middle")
                .style("font-weight", "bold")
                .style("fill", "#FDF0D5")
                .style("opacity", 0)
                .style("font-size", "1px")
                .transition()
                .delay(3000)
                .duration(600)
                .style("font-size", "30px")
                .attr("y", y(d.count) - 5)
                .style("opacity", 1)
                .text(d.count + " h")
            }, index * 300);
          });
          
          svg
            .append("g")
            .selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", (d) => x(d.assignement) + x.bandwidth() / 2)
            .attr("y", height - marginBottom + 20)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .style("fill", "#FDF0D5")
            .style("opacity", 0)
            .transition()
            .delay((_, i) => i * 200 + 1000)
            .duration(800)
            .style("opacity", 1)
            .style("font-size", "22px")
            .transition()
            .duration(300)
            .style("font-size", "16px")
            .text((d) => d.assignement);

      }
      svg.attr("transform", "rotate(90) translate(0, -400)");
      //attend 2 secondes avant de faire l'animation
      setTimeout(() => {
        animateBars();
      }, 2000);



    }, [data, frameCount]);

  return (
    <div id="hist-container">
    </div>
  );

}

export default HistogramAssignment;