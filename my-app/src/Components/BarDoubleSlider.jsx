import React from 'react';
import './BarDoubleSlider.css';


function indexToDate(index) {
    const baseYear = 1997;
    const year = baseYear + index;
    return `${year}`;
  }

function BarDoubleSlider({props}) {
    const handleChange = (e, index) => {
        const range = document.querySelector(".range-selected-bar");
        range.style.left = (props.dateRange[0] / 29) * 100 + "%";
        range.style.right = 100 - (props.dateRange[1] / 29) * 100 + "%";
        const newDate = Number(e.target.value);
        const newRange = index === 0 ? [newDate, props.dateRange[1]] : [props.dateRange[0], newDate];
    
        if (newRange[0] <= newRange[1]) {
            props.setDateRange(newRange);
        }
    };

    return(
        <div className="range-bar">
        <div className="range-slider-bar">
            <span className="range-selected-bar"></span>
        </div>
        <div className="range-input-bar">
            <input 
                type="range" 
                className="min-bar" 
                min={0}
                max={29} 
                value={props.dateRange[0]} 
                step="1"
                onChange={(e) => handleChange(e, 0)}
                />
            <input 
                type="range" 
                className="max-bar" 
                min={0} 
                max={29} 
                value={props.dateRange[1]} 
                step="1"
                onChange={(e) => handleChange(e,1)}/>
        </div>
        
        <div className="range-price-bar">      
            <label for="min">{indexToDate(props.dateRange[0])} - </label>  
            <label for="max">{indexToDate(props.dateRange[1])}</label>
        </div>
    </div> 
  );
  }

export default BarDoubleSlider;


/*
function BarDoubleSlider({props}) {
    const handleChange = (e, index) => {
        const range = document.querySelector(".range-selected-bar");
        range.style.left = (props.dateRange[0] / 28) * 100 + "%";
        range.style.right = 100 - (props.dateRange[1] / 28) * 100 + "%";
        const newDate = Number(e.target.value);
        const newRange = index === 0 ? [newDate, props.dateRange[1]] : [props.dateRange[0], newDate];
    
        if (newRange[0] < newRange[1]) {
            props.setDateRange(newRange);
        }
    };

    return(
        <div className="range-bar">
            <div className="range-slider-bar">
                <span className="range-selected-bar"></span>
            </div>
            <div className="range-input-bar">
                <input 
                    type="range" 
                    className="min-bar" 
                    min={0}
                    max={28} 
                    value={props.dateRange[0]} 
                    step="1"
                    onChange={(e) => handleChange(e, 0)}
                    />
                <input 
                    type="range" 
                    className="max-bar" 
                    min={0} 
                    max={28} 
                    value={props.dateRange[1]} 
                    step="1"
                    onChange={(e) => handleChange(e,1)}/>
            </div>
            
            <div className="range-price-bar">      
                <label for="min">{1997+props.dateRange[0]}</label>  
                <label for="max">{1997+props.dateRange[1]}</label>
            </div>
    </div> 
  );
  }

export default BarDoubleSlider;
*/