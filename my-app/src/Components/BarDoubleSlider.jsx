import React from 'react';
import './BarDoubleSlider.css';


function BarDoubleSlider({props}) {
    const handleChange = (e, index) => {
        const range = document.querySelector(".range-selected2");
        range.style.left = (props.dateRange[0] / 28) * 100 + "%";
        range.style.right = 100 - (props.dateRange[1] / 28) * 100 + "%";
        const newDate = Number(e.target.value);
        const newRange = index === 0 ? [newDate, props.dateRange[1]] : [props.dateRange[0], newDate];
    
        if (newRange[0] < newRange[1]) {
            props.setDateRange(newRange);
        }
    };

    return(
        <div className="range2">
            <div className="range-slider2">
                <span className="range-selected2"></span>
            </div>
            <div className="range-input2">
                <input 
                    type="range" 
                    className="min2" 
                    min={0}
                    max={28} 
                    value={props.dateRange[0]} 
                    step="1"
                    onChange={(e) => handleChange(e, 0)}
                    />
                <input 
                    type="range" 
                    className="max2" 
                    min={0} 
                    max={28} 
                    value={props.dateRange[1]} 
                    step="1"
                    onChange={(e) => handleChange(e,1)}/>
            </div>
            
            <div className="range-price2">      
                <label for="min">{1997+props.dateRange[0]}</label>  
                <label for="max">{1997+props.dateRange[1]}</label>
            </div>
    </div> 
  );
  }

export default BarDoubleSlider;