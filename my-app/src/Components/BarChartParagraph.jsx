import React from "react";
import "./StackedHistogramParagraph.css";

export default function BarPerGenreParagraph() {
  return (
    <div className="stacked-par">
      <h2 className="paragraph-title">Game Genre Distribution Over Time</h2>
      <p className="paragraph-text">
        This plot is a horizontal bar chart representing the number of games per genre released during the selected period.
        It allows developers and analysts to assess the popularity of each genre at a given time. By analyzing this trend,
        developers may choose to focus on a genre that has been gaining momentum in recent years.
      </p>

      <p className="paragraph-text">
        While the Kaggle dataset includes suspiciously high values for average playtime—sometimes over 1000 hours, which is quite unrealistic—
        the dataset scraped from PlayTracker provides more coherent values. However, since PlayTracker only includes around 15,000 records,
        this visualization sticks with the Kaggle dataset, it is recommended to only toggle the number-of-games variant.
      </p>

      <p className="paragraph-text">
        The visualization shows a clear dominance of indie games in recent years. This can be explained by the rise of free and accessible game development tools
        such as Unity and Unreal Engine, empowering individuals to create and publish their own games.
        This phenomenon is also explored in the Engine Usage Histogram and the Stacked Histogram below.
      </p>

      <h3 className="paragraph-subtitle">Controls</h3>
      <ul className="paragraph-list">
        <li>A slider lets you select a custom date range for filtering releases.</li>
        <li>A side panel enables you to filter by specific genres of interest.</li>
        <li>
          A toggle button switches between visualizing the raw number of games and the ratio:
          <i> median playtime / number of games</i>, which serves as a proxy for genre popularity.
        </li>
      </ul>
    </div>
  );
}