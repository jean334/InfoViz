import React, { useEffect, useState} from "react";
import * as d3 from "d3";


function LineChart({selectedGroups}) {
    const [data, setData] = useState(null);
    useEffect(() => {
        d3.dsv(",", "/assets/SteamUserLineChart.csv", (d) => ({
            date: d.date,
            users: +d.users,
            average_users: +d.average_users,
            in_game: +d.in_game,
        })).then((loadedData) => {
            setData(loadedData);
        });
    }, []);
    if (!data) return <p>Loading viz...</p>;
  return <GraphVisualization data={data} selectedGroups={selectedGroups}/>;
}


function GraphVisualization({ data, selectedGroups }) {
    const width = 1400;
    const height = 500;
    const marginTop = 20;
    const marginRight = 70;
    const marginBottom = 30;
    const marginLeft = 90;

    const [replay, setReplay] = useState(false); 

    const replayAnimation = () => {
        setReplay(false);
        setTimeout(() => setReplay(true), 0); 
      };


    useEffect(() => {
    d3.select("#line-container").select("svg").remove(); 
    const x = d3.scaleBand()
        .domain(data.map(d => d.date)) 
        .range([marginLeft, width - marginRight]);
    
    const y = d3.scaleLinear([0, d3.max(data, d => d.users)], [height - marginBottom, marginTop]);
  
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.users));
  
    const svg = d3.select("#line-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");



    const defs = svg.append("defs");
    const gradient_1 = defs
        .append("linearGradient")
        .attr("id", "gradient_1")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "50%")
        .attr("y2", "0%");
    
    gradient_1.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#FF5733"); 
    gradient_1.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#FF8D33"); 



    const g = svg.append("g");

        const zoom = d3.zoom()
            .scaleExtent([0.5, 5]) 
            .on("zoom", (event) => {
            g.attr("transform", event.transform); 
            });
    
        svg.call(zoom); 
    

    const xAxis = g.append("g")//svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickValues(data.map(d => d.date)
                .filter(d => {
                    const date = new Date(d);
                    return date.getDate() === 1 && date.getMonth() === 0;
                })
        )
        .tickFormat(d => {
            const date = new Date(d);
            return d3.timeFormat("%Y")(date);
        })
        .ticks(width / 80)
        .tickSizeOuter(0)
        );

    xAxis.select("path.domain")
        .attr("stroke-dasharray", 18*80) 
        .attr("stroke-dashoffset", 18*80) 
        .transition()
        .duration(800)
        .delay(1000)
        .ease(d3.easeCubic)
        .attr("stroke-dashoffset", 0);

    xAxis
        .call(g => g.append("text")
            .attr("x", width-marginRight + 5)
            .attr("y", 5)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("Years"))
            .attr("font-size", 2)
            .attr("opacity", 0)
            .transition()
            .delay(1500) 
            .duration(800)
            .ease(d3.easeElastic)
            .delay((d, i) => Math.random() * 1000)
            .attr("font-size", 12)
            .attr('opacity', 1)
            .attr("font-weight", "bold"); 


    const yAxis = g.append("g")//svg.append("g")
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
      

    
      yAxis.selectAll(".tick line")
        .clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.2)
        .attr("stroke-dasharray", width - marginLeft - marginRight)
        .attr("stroke-dashoffset", width - marginLeft - marginRight)
        .transition()
        .duration(2500)
        .delay((d, i) => Math.random() * 1000)
        .ease(d3.easeCubic)
        .attr("stroke-dashoffset", 0);
        
    
    
    yAxis
        .call(g => g.append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("Number of steam users"))
        .attr("font-size", 2)
        .attr("opacity", 0)
        .transition()
        .delay(1500) 
        .duration(800)
        .ease(d3.easeElastic)
        .delay((d, i) => Math.random() * 1000)
        .attr("font-size", 12)
        .attr('opacity', 1)
        .attr("font-weight", "bold"); 


    const path = g.append("path")
        .attr("fill", "none")
        .attr("stroke", "url(#gradient_1)")
        .attr("stroke-width", 2.5)
        .attr("d", line(data));
    
    const totalLength = 32000;
    
    path
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .delay(3000)
        .ease(d3.easeCubic)
        .attr("stroke-dashoffset", 0);


    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#333")
        .style("color", "white")
        .style("padding", "5px 10px")
        .style("border-radius", "5px")
        .style("display", "none")
        .style("pointer-events", "none");

    g.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.date))   
        .attr("cy", d => y(d.users)) // or whatever y accessor you're using
        .attr("r", 6)
        .attr("fill", "transparent")
        .attr("stroke", "transparent")
        .on("mouseover", function (event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 8)
            .attr("stroke", "#fff");
      
          tooltip
            .style("display", "block")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .html(`${d.date}<br>${d.users} users<br>${d.in_game} users in game`);
        })
        .on("mouseout", function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 6)
            .attr("stroke", "transparent");
      
          tooltip.style("display", "none");
        });
    }, [data, replay]);

    return (
        <div>
        <button onClick={replayAnimation} className="replay-button">Replay</button> 
        <div id="line-container"/>
        </div>)   
    ;}
        
export default LineChart;