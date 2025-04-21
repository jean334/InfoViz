import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import VizContainer from "./Components/VizContainer";
import Hairball from "./Components/Hairball";
import About from "./Pages/About";
import BarChart from "./Components/BarChart";
import ScatterPlot from "./Components/ScatterPlot";
import LineChart from "./Components/LineChart";
import EngineHistogram from "./Components/EngineHistogram";
import StackedEngineBarChart from "./Components/StackedEngineBarChart";
import StackedHistogramParagraph from "./Components/StackedHistogramParagraph";
import EngineHistogramParagraph from "./Components/EngineHistogramParagraph";
import SteamUsersLineChartParagraph from "./Components/SteamUsersLineChartParagraph";
import BarChartParagraph from "./Components/BarChartParagraph";
import ScatterPlotText from "./Components/ScatterPlotText";
import HairballParagraph from "./Components/HairballParagraph";
import DashboardIntroduction from "./Components/DashboardIntro";

import "./App.css";

const GroupsHairball = ['Indie', 'Casual', 'Action', 'Adventure', 'Simulation', 'Strategy', 
  'RPG', 'Early Access', 'Free to Play', 'Sports', 'Racing', 'Massively Multiplayer', 'Utilities', 
  'Design & Illustration', 'Violent', 'Animation & Modeling', 'Education', 'Free To Play', 'Video Production', 'Gore'];

const GroupsHive = [
  "Art", "Business_Studies", "Citizenship", 
  "Design_and_Technology", "Geography", "IT", "Language_and_literature", 
  "Music", "Religion", "People", "Everyday_life", 
  "Science", "History"
];

const noGroups = [];
const ScatterGroups = ['Indie', 'Action', 'Adventure', 'Simulation', 'Strategy', 
  'RPG', 'Early Access', 'Sports', 'Racing', 
  'Design & Illustration', 'Violent', 'Education', 'Gore'];

const HairballText = "The hairball plot is a network visualization technique that is particularly useful for large networks.Nodes from the same category attract each other. Nodes from different categories repel each other. Nodes that are linked together have an attractive force between them.";
const HiveText = "Nodes represent sub-groups (one level of hierarchy) and are placed on the axis corresponding to their parent group. Links connect two sub-groups when an article from one sub-group contains a hyperlink to an article from another sub-group. The width of the link is proportional to the number of hyperlinks between sub-groups. Intra sub-group links are not displayed to keep the visualization clearer."
const TreeText = "A Tree Plot is used to visualize the hierarchy of groups and sub-groups. This helps to better understand the structure of the dataset and how different categories relate to one another.The Tree plot's construction is animated."

const scatterText = "the dataset come from the Steam Game dataset, available on kaggle, this dataset come with almost 100 000 games and 39 features. After this processing, we have about 600 games"
const lineChartText = "The dataset was downloaded from SteamDB and processed using the Python notebook processingNumberOfSteamUser.ipynb. Missing values, particularly in Steam's early years, were filled using the first available data points."
const engineHistogramText = "The data used in this visualization was scraped using the Python notebook playTrackerScraper.ipynb (provided with this report). This script crawls information from over 15,000 games available on Steam. For the purposes of this visualization, we only retained the following attributes: Game engine used (e.g., Unity, Unreal Engine) The collected data is compiled into a single CSV file, which is then processed and formatted using processingEngineHist.ipynb."
const stackedHistText = "The data used in this visualization was scraped using the Python notebook playTrackerScraper.ipynb (provided with this report). This script crawls information from over 15,000 games available on Steam. For the purposes of this visualization, we only retained the following attributes: Estimated number of players Release date (both on Steam and original release) Genre (e.g., Shooter, Tactical, Indie) Game engine used (e.g., Unity, Unreal Engine) The collected data is compiled into a single CSV file, which is then processed and formatted using processingEngineStacked.ipynb."

const App = () => {
  return (
    <div className="App">
    <Router>
      <header className="header">
        <nav>
          <NavLink to="/" end>Vizualisation</NavLink>
          <NavLink to="/about">About the plots</NavLink>
        </nav>
      </header>

      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      </Routes>
    </Router>
    </div>
    );
  };

function Home() {
  return(
    <div className="App">
      <div className="top-container">
      <div className="logo-container">
        <img src="./steam.png" alt="WikipediaLogo" width="100"/>
      </div>
      <div className="title-container">
        <h1 className="page-title">Steam Games Visualization</h1>
      </div>
    </div>
    <div className="text-container">
      <DashboardIntroduction/>
    </div>

    <div className="text-container">
      <HairballParagraph/>
    </div>
    <div className="upper-viz">
      <div className="left-viz">
        <VizContainer viz={Hairball} title={"Hairball of steam games released during the selected period"} groups={GroupsHairball} text={HairballText}/>
      </div>
    </div>

    <div className="text-container">
      <BarChartParagraph/>
    </div>
    <div className='lower-viz'>
      <div className="center-viz">
        <VizContainer viz={BarChart} title={"Number of game of each genre released over the time period selected"} groups={GroupsHairball} text={BarChart}/>
      </div>
    </div>

    <div className="spacer">
      
    </div>

    <div className="upper-viz">
      <div className="left-viz">
          <VizContainer viz={ScatterPlot} title={"Bubble plot of the price vs number of recommendations"} groups={ScatterGroups} text={scatterText}/>
      </div>
      <div className="right-viz">
        <div className="text-container">
          <ScatterPlotText/>
        </div>
      </div>
    </div>
    {/*
    <div className="lower-viz">
      <div className="center-viz">
        <VizContainer viz={StackedBarChart} title={"Stacked Bar Chart"} groups={noGroups} text={BarChart}/>
      </div>
    </div>
    */}
    <div className="text-container">
      <SteamUsersLineChartParagraph/>
    </div>
    <div className="center-viz">
      <VizContainer viz={LineChart} title={"Line Chart representing the number of steam user over time"} groups={noGroups} text={lineChartText} hasSidePanel={false}/>
    </div>


    <div className="text-container">
      <EngineHistogramParagraph/>
    </div>
    <div className='lower-viz'>
      <div className="center-viz">
        <VizContainer viz={EngineHistogram} title={"Histogram of the most used game engine"} groups={noGroups} text={engineHistogramText} hasSidePanel={false}/>
      </div>
    </div>


      <div className="text-container">
        <StackedHistogramParagraph/>
      </div>
      <div className='lower-viz'>
        <div className="center-viz">
          <VizContainer viz={StackedEngineBarChart} title={"Stacked bar chart representing the percentage of players per game engine, specifically for the selected genre and over the selected time range"} groups={noGroups} text={stackedHistText} hasSidePanel={false}/>
        </div>
      </div>

  </div>
);
}

export default App;
