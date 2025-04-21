import React from 'react';
import './StackedDoubleSlider.css';


function indexToDate(index) {
    const baseYear = 1971;
    const year = baseYear + Math.floor(index / 12);
    const month = (index % 12) + 1;
    return `${year}/${month.toString().padStart(2, '0')}`;
  }

function StackedDoubleSlider({props}) {
    const handleChange = (e, index) => {
        const range = document.querySelector(".range-selected-stacked");
        range.style.left = (props.dateRange[0] / 640) * 100 + "%";
        range.style.right = 100 - (props.dateRange[1] / 640) * 100 + "%";
        const newDate = Number(e.target.value);
        const newRange = index === 0 ? [newDate, props.dateRange[1]] : [props.dateRange[0], newDate];
    
        if (newRange[0] <= newRange[1]) {
            props.setDateRange(newRange);
        }
    };

    return(
        <div className="range-stacked">
        <div className="range-slider-stacked">
            <span className="range-selected-stacked"></span>
        </div>
        <div className="range-input-stacked">
            <input 
                type="range" 
                className="min-stacked" 
                min={0}
                max={640} 
                value={props.dateRange[0]} 
                step="1"
                onChange={(e) => handleChange(e, 0)}
                />
            <input 
                type="range" 
                className="max-stacked" 
                min={0} 
                max={640} 
                value={props.dateRange[1]} 
                step="1"
                onChange={(e) => handleChange(e,1)}/>
        </div>
        
        <div className="range-price-stacked">      
            <label for="min">{indexToDate(props.dateRange[0])} - </label>  
            <label for="max">{indexToDate(props.dateRange[1])}</label>
        </div>
    </div> 
  );
  }

export default StackedDoubleSlider;