import React from "react";
import "./DashboardIntro.css"; 

function DashboardIntroduction() {
  return (
    <div className="dashboard-intro-container">
      <h2>Introduction</h2>
      <p>
        This storyboard provides a comprehensive overview of key trends and dynamics within the video game industry.
        Through a series of interactive visualizations, it explores the <strong>evolution of game genres</strong> over time,
        sheds light on the <strong>studios</strong> behind major titles, tracks the <strong>fluctuations in pricing</strong>,
        and highlights the <strong>rising popularity of games</strong> in general.
      </p>
      <p>
        One of the most striking trends observed across several plots is the <strong>rise of Indie games</strong>.
        Indie games are typically developed by small teams or individual developers, often outside the traditional
        major publishing frameworks. These projects have become increasingly prominent in recent years.
        This growth can be attributed to the emergence of powerful, free, and accessible tools such as
        <strong>game engines</strong> like Unity and Unreal Engine, which have democratized the development process.
      </p>
      <p>
        The visualizations presented here allow us to understand which genres gained traction at different periods,
        how major and independent studios contributed to the ecosystem, and how market variables such as price and
        user engagement evolved. They also serve different audiences: from <strong>gamers</strong> curious to explore
        game trends and discover new titles, to <strong>developers</strong> seeking insights into market opportunities
        or inspiration from successful production paths.
      </p>
      <p>
        Altogether, this storyboard builds a <strong>narrative</strong> that connects data with history and industry practices,
        offering both analytical depth and playful interactivity aligned with the spirit of video games themselves.
      </p>
    </div>
  );
}

export default DashboardIntroduction;
