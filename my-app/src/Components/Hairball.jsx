import React, { useEffect, useState} from "react";
import * as d3 from "d3";
import data from "../assets/test4.json";
import "./Hairball.css";
import Slider from "./Slider";
import DateSlider from "./DateSlider";

function Hairball({selectedGroups}) {
  if (!data) return <p>Loading viz...</p>;

  return <GraphVisualization data={data} selectedGroups={selectedGroups}/>;
}

function GraphVisualization({ data, selectedGroups }) {
  const [nbIntraLink, setNbIntraLink] = useState(0.02); // Valeur initiale du slider
  const [nbInterLink, setNbInterLink] = useState(0.2); // Valeur initiale du slider
  const [dateRange, setDateRange] = useState(["1997-06-30", "2025-04-14"]);

  const [visibleNodes, setVisibleNodes] = useState([]);
  const [visibleLinks, setVisibleLinks] = useState([]);

  useEffect(() => {
    const width = 928 * 2;
    const height = 680 * 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    d3.select("#graph-container").select("svg").remove();

    const svg = d3.select("#graph-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("max-width", "100%")
      .style("height", "auto")
      .style("border", "1px solid #333533")
      .style("border-radius", "8px");

      const zoom = d3.zoom()
      .scaleExtent([0.5, 5]) // Zoom entre 50% et 500%
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const g = svg.append("g"); // Conteneur pour les éléments zoomables

    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));
    

    /*
    const filteredNodes = nodes.filter(node =>
      node.group.some(group => selectedGroups.has(group))
    );

    
    let filteredLinks = links.filter(link =>
      link.source_group.some(group => selectedGroups.has(group)) &&
      link.target_group.some(group => selectedGroups.has(group))
    );
    */
    let filteredLinks = links;

    filteredLinks = filteredLinks.filter(link => {
        const differentCluster = link.source_group[0] !== link.target_group[0];
        return differentCluster || Math.random() < nbIntraLink; // Garde 20% des liens inter-cluster
    });

    filteredLinks = filteredLinks.filter(link => {
        const differentCluster = link.source_group[0] == link.target_group[0];
        return differentCluster || Math.random() < nbInterLink; // Garde 20% des liens inter-cluster
    });
    
    const startDate = new Date("1997-06-30"); // Date minimale
    const endDate = new Date("1997-06-30");   // Date maximale
    
    const filteredNodes = nodes.filter(node => {
        const nodeDate = new Date(node.release_date);
         
        return nodeDate >= new Date(dateRange[0]) && nodeDate <= new Date(dateRange[1]);
    });
    
    const nodeIds = new Set(filteredNodes.map(node => node.id));

    filteredLinks = links.filter(link => 
        nodeIds.has(link.source) && nodeIds.has(link.target)
    );
    
    console.log(filteredNodes);
    console.log(new Date(dateRange[0]));

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
    const node = g.append("g")
      //.attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(filteredNodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", d => color(d.genres[0]))
      
      //.style("opacity", 0)
      //.transition().duration(500)
      //.style("opacity", 1)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

      const legend = svg.append("g")
      .attr("transform", `translate(${width / 2 - 100}, ${height / 2 - 600})`);
      
      const uniqueGroups = Array.from(new Set(nodes.flatMap(node => node.genres[0])));
      uniqueGroups.forEach((group, i) => {
        const legendRow = legend.append("g")
          .attr("transform", `translate(${-150}, ${i*70 - 600})`);
      
        legendRow.append("rect")
          .attr("width", 30)
          .attr("height", 30)
          .attr("fill", color(group));
      
        legendRow.append("text")
          .attr("x", -20)
          .attr("y", -10)
          .attr("text-anchor", "start")
          .attr("font-size", "24px")
          .attr("fill", "#E8EDDF")
          .text(group);
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
            .text(d.id);
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
        .attr("r", 5)//d => d.radius)
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
  <div id="graph-container">
    <div className="slider-container">
        <Slider nbLink={nbIntraLink} setNbLink={setNbIntraLink} className="slider-intra"  htmlFor="intra_link" label="intra link"/>
        <Slider nbLink={nbInterLink} setNbLink={setNbInterLink} className="slider-inter"  htmlFor="inter_link" label="inter link"/>
        <DateSlider minDate="1997-06-30" maxDate="2025-04-14" dateRange={dateRange} setDateRange={setDateRange} className="date-slider" label="Date Range"/>
    </div>
  </div>)
  
  ; 
}

export default Hairball;



