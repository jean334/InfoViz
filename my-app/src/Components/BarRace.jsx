import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import data from "../assets/barRace1.json";
import "./BarRace.css";

const generateKeyframes = () => {
  const data = [
    { name: "A", value: Math.random() * 100 },
    { name: "B", value: Math.random() * 100 },
    { name: "C", value: Math.random() * 100 },
    { name: "D", value: Math.random() * 100 },
  ];

  const keyframes = Array.from({ length: 20 }, (_, i) => {
    const updatedData = data.map((d) => ({ ...d, value: d.value + Math.random() * 10 }));

    const rankedData = updatedData
      .sort((a, b) => b.value - a.value)
      .map((d, index) => ({ ...d, rank: index }));

    return [`2025-03-${i + 1}`, rankedData]; 
  });

  return keyframes;
};

  
  const BarRace = ({duration = 250, width = 1400, height = 300, n = 12 }) => {
    const keyframes = data;
    const svgRef = useRef();
    const [replay, setReplay] = useState(false); 
    const barSize = 48;
    const marginTop = 16;
    const marginBottom = 6;
    const marginLeft = 0;
    const marginRight = 100;

    const x = d3.scaleLinear([0, 1], [marginLeft, width - marginRight]);
    const y = d3
      .scaleBand()
      .domain(d3.range(n))
      .rangeRound([marginTop, marginTop + barSize * n])
      .padding(0.1);
  
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);
  
    const replayAnimation = () => {
      setReplay(false);
      setTimeout(() => setReplay(true), 0); 
    };
    useEffect(() => {
      if (!svgRef.current || !keyframes || keyframes.length === 0) return;
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); 
      svg
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height);
  
      const gBars = svg.append("g").attr("fill-opacity", 1);
      const gLabels = svg.append("g").attr("text-anchor", "end");
      const gTicker = svg.append("text").attr("x", width - 6).attr("y", marginTop).style("font", "bold 35px sans-serif");
  
      const updateBars = (data, transition) => {
        const bars = gBars.selectAll("rect").data(data, (d) => d.name);
        bars
          .join(
            (enter) =>
              enter
                .append("rect")
                .attr("fill", (d) => colorScale(d.name))
                .attr("x", x(0))
                .attr("y", (d) => y(d.rank))
                .attr("height", y.bandwidth())
                .attr("width", (d) => x(d.value/5) - x(0)),
            (update) => update,
            (exit) => exit.transition(transition).attr("width", 0).remove()
          )
          if(transition) {
            bars.call((bar) =>
            bar
              .transition(transition)
              .attr("y", (d) => y(d.rank)) 
              .attr("width", (d) => x(d.value) - x(0))
          );}
      };
  
      const updateLabels = (data, transition) => {
        const labels = gLabels.selectAll("text").data(data, (d) => d.name);
        
        labels
          .join(
            (enter) =>
              enter
                .append("text")
                .attr("x", -6)
                .attr("y", (d) => y(d.rank) + y.bandwidth() / 2)
                .attr("dy", "0.35em")
                .text((d) => d.name + ": " + Math.round(d.value)),
            (update) =>
              update, 
            (exit) =>
              exit.transition(transition).attr("opacity", 0).remove() 
          )
          if(transition) {
            labels
            .call((label) =>
                label
                  .transition(transition)
                  .attr("x", 120)
                  .attr("y", (d) => y(d.rank) + y.bandwidth() / 2)
                  .attr('fill', '#FDF0D5')
                  .selection() 
                  .text((d) => d.name + ": " + Math.round(d.value)) 
              );
          }
      };
  
      const updateTicker = (date, transition) => {
        gTicker
        .attr('fill', '#FDF0D5')
        .attr('x', width - marginRight-140)
        .attr('y', height - marginBottom-50)
        .transition(transition).text(date.slice(0,7));
          
      };

      
      (async function animateChart() {
        for (const { date, val } of keyframes) {
          if (!val || val.length === 0) continue; 
  
          const transition = svg.transition()
            .duration(duration)
            .ease(d3.easeLinear);

          x.domain([0, 3000]); 

          updateBars(val, transition);
          updateLabels(val, transition);
          updateTicker(date, transition);
            try {
              await transition.end();
            } catch (e) {
              console.log("Transition interrupted:", e);
            }
          }
      })();
      
    }, [keyframes, replay, svgRef]); 
  
    return (
      <div>
        <button onClick={replayAnimation} className="replay-button">Replay</button> 
        <svg ref={svgRef} className="bar-race"></svg>
      </div>
    );
  };
  
  export default BarRace;

