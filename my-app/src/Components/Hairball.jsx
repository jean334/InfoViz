import React, { useEffect, useState} from "react";
import * as d3 from "d3";
import data from "../assets/HairballDataset.json";
import "./Hairball.css";
import HairballDoubleSlider from "./HairballDoubleSlider";

function Hairball({selectedGroups}) {
  if (!data) return <p>Loading viz...</p>;

  return <GraphVisualization data={data} selectedGroups={selectedGroups}/>;
}


function indexToDate(index) {
  const baseYear = 1997;
  const year = baseYear + Math.floor(index / 12);
  const month = (index % 12) + 1;
  return `${year}/${month.toString().padStart(2, '0')}`;
}



function GraphVisualization({ data, selectedGroups }) {
  const [nbIntraLink, setNbIntraLink] = useState(0.02); 
  const [nbInterLink, setNbInterLink] = useState(0.2);
  //const [dateRange, setDateRange] = useState(["2024-06-30", "2025-04-14"]);
  const [dateRange, setDateRange] = useState([300, 334]);
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
    const width = 1400;
    const height = 800;
    const marginTop = 20;
    const marginRight = 70;
    const marginBottom = 30;
    const marginLeft = 90;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    d3.select("#graph-container").select("svg").remove();

    const svg = d3.select("#graph-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width+marginRight+marginLeft, height + marginTop + marginBottom])
      .style("max-width", "100%")
      .style("height", "auto")
      //.style("border", "1px solid #333533")
      .style("align-items", "center")
      .style("border-radius", "8px");


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

      const zoom = d3.zoom()
      .scaleExtent([0.01, 5]) 
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const g = svg.append("g");

    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));
    
    let filteredNodes = nodes.filter(node =>
      node.genres.some(genre => selectedGroups.has(genre))
    );

    let filteredLinks = links;


    filteredLinks = filteredLinks.filter(link => {
        //const differentCluster = link.source_group[0] !== link.target_group[0];
        //return differentCluster || Math.random() < nbIntraLink; 
        return Math.random() < nbIntraLink; 
    });

    filteredLinks = filteredLinks.filter(link => {
        //const differentCluster = link.source_group[0] == link.target_group[0];
        //return differentCluster || Math.random() < nbInterLink; 
        return Math.random() < nbInterLink; 
    });
    
    
    filteredNodes = filteredNodes.filter(node => {
        const nodeDate = new Date(node.release_date);
        return nodeDate >= new Date(indexToDate(dateRange[0])) && nodeDate <= new Date(indexToDate(dateRange[1]));
    });
    
    const nodeIds = new Set(filteredNodes.map(node => node.id));

    filteredLinks = links.filter(link => 
        nodeIds.has(link.source) && nodeIds.has(link.target)
    );

    const simulation = d3.forceSimulation(filteredNodes)
      .force("link", d3.forceLink(filteredLinks).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY())


    // Fonction d'ajout progressif des nœuds
    /*
    let index = 0;
    const addNodesGradually = () => {
      if (index < filteredNodes.length) {
        setVisibleNodes(prevNodes => {
          const newNodes = [...prevNodes, filteredNodes[index]];
          
          // Met à jour les liens en ajoutant ceux qui deviennent valides
          const newLinks = links.filter(link =>
            newNodes.find(n => n.id === link.source) &&
            newNodes.find(n => n.id === link.target)
          );

          setVisibleLinks(newLinks);
          return newNodes;
        });
        index++;
        setTimeout(addNodesGradually, 200); // Ajoute un nouveau nœud toutes les 200ms
      }
    };
    */

    //addNodesGradually();

      

    const link = g.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(filteredLinks)
      .join("line");
      /*
      .style("opacity", 0)
      .attr("stroke-width", d => Math.sqrt(d.value))
      .transition().duration(500)
      .style("opacity", 1);
      */
    const maxOwners = d3.max(filteredNodes, d => d.estimated_owners);
    const minOwners = d3.min(filteredNodes, d => d.estimated_owners);

    function computeRadius(owners) {
      const minRadius = 5; // Rayon minimum
      const maxRadius = 20; // Rayon maximum
      const scale = d3.scaleLinear()
        .domain([minOwners, maxOwners])
        .range([minRadius, maxRadius]);
      return scale(owners);
    }

    const node = g.append("g")
      //.attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(filteredNodes)
      .join("circle")
      .attr("r", 20)//d => 20)//computeRadius(d.estimated_owners))
      .attr("fill", d => getGradientUrl(d.genres[0]))
      //.attr("fill", d => color(d.genres[0]))
      
      //.style("opacity", 0)
      //.transition().duration(500)
      //.style("opacity", 1)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

      /*
      const legend = svg.append("g")
      .attr("transform", `translate(${width / 2 - 100}, ${height / 2 - 600})`);
      
      const uniqueGroups = Array.from(new Set(filteredNodes.flatMap(node => node.genres[0])));
      uniqueGroups.forEach((group, i) => {
        const legendRow = legend.append("g")
          .attr("transform", `translate(${-150}, ${i*70 - 600})`);
      
        legendRow.append("rect")
          .attr("width", 30)
          .attr("height", 30)
          .attr("fill", () => getGradientUrl(group))
        legendRow.append("text")
          .attr("x", -20)
          .attr("y", -10)
          .attr("text-anchor", "start")
          .attr("font-size", "24px")
          .attr("fill", "#E8EDDF")
          .text(group);
      });
      */
         const legend = svg.append("g")
         
         //const uniqueGroups = ['Indie', 'Action', 'Adventure', 'Casual', 'Simulation', 'Strategy', 'RPG', 'Sports', 'Massively Multiplayer', 'Racing', 'Puzzle', 'Platformer', 'Early Access', 'Free to Play', 'VR']
         const uniqueGroups = [...new Set(filteredNodes.map(d => d.genres[0]))];
         uniqueGroups.forEach((group, i) => {
             const legendRow = legend.append("g")
    
             .attr("transform", `translate(${width-800}, ${i*50 - 100})`);
     
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
             .delay((d, i) => i * 600)
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
             .delay((d, i) => i * 600)
             .attr("opacity", 1);
             });

    const groupCenters = new Map();

    // Définition des positions centrales des groupes
    uniqueGroups.forEach((group, i) => {
      groupCenters.set(group, { x: (i % 3) * 200 - width / 4, y: Math.floor(i / 3) * 200 - height / 4 });
    });

    // Ajout d'une force qui attire chaque groupe vers son centre
    simulation.force("grouping", d3.forceManyBody().strength(-15)) // Répulsion entre tous les noeuds
  .force("groupCenter", d3.forceX().x(d => {
    const group = d.genres[0]; // Prend le premier groupe pour l'attraction
    return groupCenters.has(group) ? groupCenters.get(group).x : 0;
  }).strength(0.1))
  .force("groupY", d3.forceY().y(d => {
    const group = d.genres[0];
    return groupCenters.has(group) ? groupCenters.get(group).y : 0;
  }).strength(0.1));
      
        
    //node.append("title").text(d => d.id);
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
        d3.select(this);//.transition().duration(200).attr("r", d.radius * 1.5); // Augmente la taille du nœud
        tooltip.style("display", "block")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .text(`${d.id} | 
              Number of owners : ${d.estimated_owners} | 
              Publisher : ${d.publisher}`);
    });
    
    node.on("mouseout", function () {
        d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 5);//d => d.radius); 
        tooltip.style("display", "none");
    });
      

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("r", d => computeRadius(d.estimated_owners))//d => d.radius)
        .attr("cy", d => d.y);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }


    return () => simulation.stop(); // Nettoyage du simulation
  }, [data, selectedGroups, nbInterLink, nbIntraLink, dateRange]);

  return (
    <div>
      {/*<div className="top-controls-hairball">
        <div className="slider-container-hairball">*/}
          <HairballDoubleSlider props={{ dateRange: dateRange, setDateRange: setDateRange }} />
        {/*</div>
      </div>*/}
    <div id="graph-container">
    {/*
      <div className="slider-container">
          <Slider nbLink={nbIntraLink} setNbLink={setNbIntraLink} className="slider-intra"  htmlFor="intra_link" label="intra link"/>
          <Slider nbLink={nbInterLink} setNbLink={setNbInterLink} className="slider-inter"  htmlFor="inter_link" label="inter link"/>

      </div>
      */}
    </div>
  </div>)
  
  ; 
}

export default Hairball;



