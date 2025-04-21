import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import "./StackedBarChart.css";
import StackedDoubleSlider from "./StackedDoubleSlider";
import EngineStackedSlider from "./EngineStackedSlider";


function indexToDate(index) {
    const baseYear = 1971;
    const year = baseYear + Math.floor(index / 12);
    const month = (index % 12) + 1;
    return `${year}/${month.toString().padStart(2, '0')}`;
  }

function StackedEngineBarChart({ selectedGroups }) {
    const [data, setData] = useState(null);


    useEffect(() => {
      d3.dsv(",", "/assets/StackedEngine.csv", (d) => ({
        date: d.date,
        engine: d.engine,
        Sport: +d.Sport,
        Point_and_click: +d.Point_and_click,
        Card_board_game: +d.Card_board_game,
        MOBA: +d.MOBA,
        Adventure: +d.Adventure,
        Simulator: +d.Simulator,
        RPG: +d.RPG,
        Racing: +d.Racing,
        RTS: +d.RTS,
        Pinball: +d.Pinball,
        Tactical: +d.Tactical,
        Indie: +d.Indie,
        Platform: +d.Platform,
        Strategy: +d.Strategy,
        Visual_Novel: +d.Visual_Novel,
        Arcade: +d.Arcade,
        Music: +d.Music,
        TBS: +d.TBS,
        Shooter: +d.Shooter,
        Puzzle: +d.Puzzle,
        Fighting: +d.Fighting,
      })).then((loadedData) => {
        setData(loadedData);
      });
    }, []);
  
    if (!data) return <p>Loading viz...</p>;
  
    return <GraphVisualization data={data} selectedGroups={selectedGroups}/>;
  }


function getGradientUrl(category) {
    return `url(#gradient_${category})`;
}


  function GraphVisualization({ data, selectedGroups }) {
    const width = 1400;
    const height = 600;
    const marginTop = 10;
    const marginRight = 70;
    const marginBottom = 100;
    const marginLeft = 50;
    const barRadius = 2; 

    const svgRef = useRef(null);        
    const xScaleRef = useRef(null);      
    const yScaleRef = useRef(null);      
    const stackedDataRef = useRef(null); 
    const subgroupsRef = useRef(null);   

    const [replay, setReplay] = useState(false); 
    const [dateRange, setDateRange] = useState([300, 640]);
    const [selectedGenreIndex, setSelectedGenreIndex] = useState(0);
    const categoryColors = {
        Sport: ["#FF5733", "#FF8D33"],
        Point_and_click: ["#FF33A1", "#FF33D4"], 
        Card_board_game: ["#33FF57", "#33FF8D"],
        MOBA: ["#3357FF", "#338DFF"],
        Adventure: ["#FF33A1", "#FF33D4"],
        Simulator: ["#FF5733", "#FF8D33"],
        RPG: ["#FF33A1", "#FF33D4"],
        Racing: ["#33FF57", "#33FF8D"],
        RTS: ["#3357FF", "#338DFF"],
        Pinball: ["#FF33A1", "#FF33D4"],
        Tactical: ["#FF5733", "#FF8D33"],
        Indie: ["#FF33A1", "#FF33D4"],
        Platform: ["#33FF57", "#33FF8D"],
        Strategy: ["#3357FF", "#338DFF"],
        Visual_Novel: ["#FF33A1", "#FF33D4"],
        Arcade: ["#FF5733", "#FF8D33"],
        Music: ["#FF33A1", "#FF33D4"],
        TBS: ["#33FF57", "#33FF8D"],
        Shooter: ["#3357FF", "#338DFF"],
        Puzzle: ["#FF33A1", "#FF33D4"],
        Fighting: ["#FF5733", "#FF8D33"],
    };
    
    const replayAnimation = () => {
        setReplay(false);
        setTimeout(() => setReplay(true), 0); 
      };

    useEffect(() => {
        d3.select("#stacked-engine-container").select("svg").remove();

        const svg = d3.select("#stacked-engine-container")
            .append("svg")
            .attr("width", width + marginLeft + marginRight)
            .attr("height", height + marginTop + marginBottom)
            .attr("viewBox", [0, 0, width + marginLeft + marginRight, height + marginTop + marginBottom])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
            .attr("transform", `translate(${marginLeft},${marginTop})`)
            .call(zoom);

        svgRef.current = svg;


        const subgroups = data.columns.slice(2);
        subgroupsRef.current = subgroups;
        const selectedGenre = subgroups[selectedGenreIndex];

        const [startIndex, endIndex] = dateRange;
        const startDate = indexToDate(startIndex);
        const endDate = indexToDate(endIndex);

        const month_data = data.filter(d => {
        return d.date >= startDate && d.date <= endDate;
        });

        const grouped_data = d3.rollups(month_data, v => ({
            Sport: d3.sum(v, d => d.Sport),
            Point_and_click: d3.sum(v, d => d.Point_and_click),
            Card_board_game: d3.sum(v, d => d.Card_board_game),
            MOBA: d3.sum(v, d => d.MOBA),
            Adventure: d3.sum(v, d => d.Adventure),
            Simulator: d3.sum(v, d => d.Simulator),
            RPG: d3.sum(v, d => d.RPG),
            Racing: d3.sum(v, d => d.Racing),
            RTS: d3.sum(v, d => d.RTS),
            Pinball: d3.sum(v, d => d.Pinball),
            Tactical: d3.sum(v, d => d.Tactical),
            Indie: d3.sum(v, d => d.Indie),
            Platform: d3.sum(v, d => d.Platform),
            Strategy: d3.sum(v, d => d.Strategy),
            Visual_Novel: d3.sum(v, d => d.Visual_Novel),
            Arcade: d3.sum(v, d => d.Arcade),
            Music: d3.sum(v, d => d.Music),
            TBS: d3.sum(v, d => d.TBS),
            Shooter: d3.sum(v, d => d.Shooter),
            Puzzle: d3.sum(v, d => d.Puzzle),
            Fighting: d3.sum(v, d => d.Fighting), 
        }),
        d => d.engine);

        const totalSport = d3.sum(data, d => d.Sport);
        const totalPoint_and_click = d3.sum(data, d => d.Point_and_click);
        const totalCard_board_game = d3.sum(data, d => d.Card_board_game);
        const totalMOBA = d3.sum(data, d => d.MOBA);
        const totalAdventure = d3.sum(data, d => d.Adventure);
        const totalSimulator = d3.sum(data, d => d.Simulator);
        const totalRPG = d3.sum(data, d => d.RPG);
        const totalRacing = d3.sum(data, d => d.Racing);
        const totalRTS = d3.sum(data, d => d.RTS);
        const totalPinball = d3.sum(data, d => d.Pinball);
        const totalTactical = d3.sum(data, d => d.Tactical);
        const totalIndie = d3.sum(data, d => d.Indie);
        const totalPlatform = d3.sum(data, d => d.Platform);
        const totalStrategy = d3.sum(data, d => d.Strategy);
        const totalVisual_Novel = d3.sum(data, d => d.Visual_Novel);
        const totalArcade = d3.sum(data, d => d.Arcade);
        const totalMusic = d3.sum(data, d => d.Music);
        const totalTBS = d3.sum(data, d => d.TBS);
        const totalPuzzle = d3.sum(data, d => d.Puzzle);
        const totalFighting = d3.sum(data, d => d.Fighting);
        const totalShooter = d3.sum(data, d => d.Shooter);
        const totalPlayer = totalSport + totalPoint_and_click + totalCard_board_game + totalMOBA + totalAdventure + totalSimulator + totalRPG + totalRacing + totalRTS + totalPinball + totalTactical + totalIndie + totalPlatform + totalStrategy + totalVisual_Novel + totalArcade + totalMusic + totalTBS + totalPuzzle + totalFighting + totalShooter;


        const aggregated_by_engine = grouped_data.map(([engine, sums]) => ({
            engine: engine,
            Sport: sums.Sport / totalSport * 100,
            Point_and_click: sums.Point_and_click / totalPoint_and_click * 100,
            Card_board_game: sums.Card_board_game / totalCard_board_game * 100,
            MOBA: sums.MOBA / totalMOBA * 100,
            Adventure: sums.Adventure / totalAdventure * 100,
            Simulator: sums.Simulator / totalSimulator * 100,
            RPG: sums.RPG / totalRPG * 100,
            Racing: sums.Racing / totalRacing * 100,
            RTS: sums.RTS / totalRTS * 100,
            Pinball: sums.Pinball / totalPinball * 100,
            Tactical: sums.Tactical / totalTactical * 100,
            Indie: sums.Indie / totalIndie * 100,
            Platform: sums.Platform / totalPlatform * 100,
            Strategy: sums.Strategy / totalStrategy * 100,
            Visual_Novel: sums.Visual_Novel / totalVisual_Novel * 100,
            Arcade: sums.Arcade / totalArcade * 100,
            Music: sums.Music / totalMusic * 100,
            TBS: sums.TBS / totalTBS * 100,
            Shooter: sums.Shooter / totalShooter * 100,
            Puzzle: sums.Puzzle / totalPuzzle * 100,
            Fighting: sums.Fighting / totalFighting * 100,
          }));
            
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

        createGradients(svg); 

       const stackedData = d3.stack()
            .keys(subgroups)(aggregated_by_engine);

        
        const enginesWithData = new Set();
        stackedData.forEach(layer => {
            layer.forEach(d => {
              const height = d[1] - d[0];
              if (height > 3) {
                enginesWithData.add(d.data.engine);
              }
            });
          });
 

        const filteredStackedData = stackedData.map(layer => {
            const filteredLayer = layer.filter(d => enginesWithData.has(d.data.engine));
            filteredLayer.key = layer.key; // <-- Restaurer la propriété .key
            return filteredLayer;
          });

        stackedDataRef.current = filteredStackedData;

        const alignLayer = filteredStackedData.find(layer => layer.key === selectedGenre);
        
        const sortedEngines = [...alignLayer]
            .sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]))
            .map(d => d.data.engine);
        
        const x = d3.scaleBand()
          .domain(sortedEngines)
          .range([marginLeft, width - marginRight])
          .padding(0.1);

        xScaleRef.current = x;

        let countEngines = sortedEngines.length;
        const tickValues = sortedEngines
            .filter((_, i) => {
              if (countEngines >= 30) {
                return i % 3 === 0;
              } else if (countEngines >= 10) {
                return i % 2 === 0;
              } else {
                return i % 1 === 0;
              }
            });

      
        const xAxis = d3.axisBottom(x)
            .tickValues(tickValues) 
            .tickSizeOuter(0);

        const y = d3.scaleLinear()
        .domain([0, 100])
        .nice()
        .range([height, 0]);
        yScaleRef.current = y;

        const engineOffsets = new Map();
        alignLayer.forEach(d => {
        const offset = y(0) - y(d[0]) + marginTop;
        engineOffsets.set(d.data.engine, offset);
        });

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "#333")
            .style("color", "white")
            .style("padding", "5px 10px")
            .style("border-radius", "5px")
            .style("display", "none")
            .style("pointer-events", "none");
    
        const grayColors = ["#1a1a1a", "#2a2a2a"];
        const grayScale = d3.scaleOrdinal()
            .domain(subgroups)
            .range(grayColors);

        function animateBars() {
            filteredStackedData.forEach((layer, layerIndex) => {
            console.log("selectedGenre", selectedGenre);
            svg.append("g")
            .attr("fill", (d, i) => {
                if (layer.key === selectedGenre) {
                  return getGradientUrl(layer.key);
                } else {
                  const baseColor = d3.color(grayScale(layer.key));
                  const modified = baseColor.darker(i % 2 === 0 ? 0.5 : -0.5);
                  return modified.formatHex();
                }
              })
            .selectAll("rect")
            .data(layer)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.data.engine))
            .attr("y", y(0))
            .attr("rx", barRadius)
            .attr("ry", barRadius)
            .attr("data-layer-key", layer.key) 
            .attr("height", 0)
            .attr("width", x.bandwidth())
            
            
            .on("mouseover", function(event, d) {
                tooltip.style("display", "block")
                    .html(`
                        <strong>Engine:</strong> ${d.data.engine}<br/>
                        <strong>Category:</strong> ${layer.key}<br/>
                        <strong>Value:</strong> ${d.data[layer.key].toFixed(2)} %
                    `);
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseleave", function() {
                tooltip.style("display", "none");
            })
        
            .transition()
            .delay((d, i) => 150 * layerIndex + Math.random() * 100)
            .duration(800)
            .attr("y", d => y(d[1]) + engineOffsets.get(d.data.engine))
            .attr("height", d => y(d[0]) - y(d[1]))
            .ease(d3.easeBackOut);
        });
        }
        animateBars();
        const defs = svg.append("defs");
        defs.append("linearGradient")
        .attr("id", "fade-top")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%")
        .selectAll("stop")
        .data([
          { offset: "0%", opacity: 1 },
          { offset: "100%", opacity: 0 }
        ])
        .enter()
        .append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", "#001e2e")
        .attr("stop-opacity", d => d.opacity);
      
      defs.append("linearGradient")
        .attr("id", "fade-bottom")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%")
        .selectAll("stop")
        .data([
          { offset: "0%", opacity: 0 },
          { offset: "100%", opacity: 1 }
        ])
        .enter()
        .append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", "#001e2e")
        .attr("stop-opacity", d => d.opacity);

        svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", 200)
            .attr("fill", "url(#fade-top)")
            .attr("pointer-events", "none");

        svg.append("rect")
            .attr("x", 0)
            .attr("y", height - 100)
            .attr("width", width)
            .attr("height", 300)
            .attr("fill", "url(#fade-bottom)")
            .attr("pointer-events", "none");

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height + marginTop})`)
            .call(xAxis)
            .selectAll("text")  
            .style("text-anchor", "end") 
            .attr("dx", "-0.5em")  
            .attr("dy", "-0.2em") 
            .attr("text-anchor", "end")
            .attr("font-size", 12)
            .attr("font-weight", "bold")
            .attr("transform", "rotate(-45)");

        const yAxis = svg.append("g")
            .call(d3.axisLeft(y)
            .ticks(height / 40))
            .attr("transform", `translate(${marginLeft},${marginTop})`);

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
            .attr("y", -30)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("Percentage of player for the selected category (%)"))
            .attr("font-size", 2)
            .attr("opacity", 0)
            .transition()
            .delay(1500) 
            .duration(800)
            .ease(d3.easeElastic)
            .delay((d, i) => Math.random() * 500)
            .attr("font-size", 15)
            .attr('opacity', 1)
            .attr("font-weight", "bold"); 

        function zoom(svg) {
            const extent = [[marginLeft, marginTop], [width - marginRight, height - marginTop]];
        
            svg.call(d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", zoomed));
        
            function zoomed(event) {
                x.range([marginLeft, width - marginRight].map(d => event.transform.applyX(d)));
                filteredStackedData.forEach(layer => {
                    svg.selectAll(`rect[data-layer-key="${layer.key}"]`)
                      .data(layer, d => d.data.engine)
                      .attr("x", d => x(d.data.engine))
                      .attr("width", x.bandwidth());
                  });
            }
        }

    }, [data, replay, selectedGroups, dateRange]);

    useEffect(() => {
        const svg = svgRef.current;
        const y = yScaleRef.current;
        const stackedData = stackedDataRef.current;
        const subgroups = subgroupsRef.current;
        const selectedGenre = subgroups[selectedGenreIndex];

        console.log("selectedGenre in 2nd useEffect", selectedGenre);
        if (!svg || !y || !stackedData) return;
      

        const alignLayer = stackedData.find(layer => layer.key === selectedGenre);
        
        const sortedEngines = [...alignLayer]
        .sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]))
        .map(d => d.data.engine);
        
        const x = d3.scaleBand()
          .domain(sortedEngines)
          .range([marginLeft, width - marginRight])
          .padding(0.1);

        let countEngines = sortedEngines.length;
        const tickValues = sortedEngines
            .filter((_, i) => {
            if (countEngines >= 30) {
              return i % 3 === 0;
            } else if (countEngines >= 10) {
              return i % 2 === 0;
            } else {
              return i % 1 === 0;
            }
          });
    
        const xAxis = d3.axisBottom(x)
            .tickValues(tickValues) 
            .tickSizeOuter(0);
    
          
        svg.select(".x-axis").remove(); 
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height + marginTop})`)
            .call(xAxis)
            .selectAll("text")  
            .style("text-anchor", "end") 
            .attr("font-size", 12)
            .attr("font-weight", "bold")
            .attr("dx", "-0.5em")  
            .attr("dy", "-0.2em") 
            .attr("transform", "rotate(-45)");


        const engineOffsets = new Map();
        alignLayer.forEach(d => {
          const offset = y(0) - y(d[0]) + marginTop;
          engineOffsets.set(d.data.engine, offset);
        });
        const grayColors = ["#1a1a1a", "#2a2a2a"];
        const grayScale = d3.scaleOrdinal()
          .domain(subgroups)
          .range(grayColors);

        stackedData.forEach(layer => {
          svg.selectAll(`rect[data-layer-key="${layer.key}"]`)
            .data(layer, d => d.data.engine)
            .attr("fill", "#0c0c0c")
            .transition()
            .duration(600)
            .attr("fill", (d, i) => {
                if (layer.key === selectedGenre) {
                  return getGradientUrl(layer.key);
                } else {
                  const baseColor = d3.color(grayScale(layer.key));
                  const modified = baseColor.darker(i % 2 === 0 ? 0.5 : -0.5);
                  return modified.formatHex();
                }
              })
            .attr("x", d => x(d.data.engine)) 
            .attr("width", x.bandwidth())     
            .attr("y", d => y(d[1]) + engineOffsets.get(d.data.engine))
            .attr("height", d => y(d[0]) - y(d[1]));
        });
      
      }, [selectedGenreIndex]);
      
      return (
        <div>
           
          <div className="top-controls">
            <div className="slider-container2">
              <StackedDoubleSlider props={{ dateRange: dateRange, setDateRange: setDateRange }} />
            </div>

            {subgroupsRef.current && subgroupsRef.current[selectedGenreIndex] &&
              <div className="slider-container2">
                <EngineStackedSlider
                  count={selectedGenreIndex}
                  genre={subgroupsRef.current[selectedGenreIndex]}
                  setCount={setSelectedGenreIndex}
                  maxValue={20}
                  htmlFor="genre-slider"
                  label="Genre"
                />
              </div>
          }     
          </div>
          <button onClick={replayAnimation} className="replay-button">Replay</button>
          <div id="stacked-engine-container" className="stacked-engine-container"></div>
        </div>
      );
}

export default StackedEngineBarChart;