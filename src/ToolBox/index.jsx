import React from 'react'
import cx from "classnames";
import classes from "./index.module.css";
import {COLORS, FILL_TOOL_TYPES, STROKE_TOOL_TYPES} from "../constants.jsx";
import toolboxContext from '../Store/toolbox-context';
import { useContext } from "react";
import BoardContext from '../Store/board-context.jsx';
const ToolBox = () => {
    const {activeToolItem} = useContext(BoardContext);
    const {toolboxState, changeStroke, changeFill} = useContext(toolboxContext);

    const strokeColor = toolboxState[activeToolItem]?.stroke;
    const fillColor = toolboxState[activeToolItem]?.fill;

    
    // const colorClickHandler = (color) =>{

    // };
  return (
    <div className={classes.container}>
       { STROKE_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
            <div className={classes.toolBoxLevel}>Stroke Color</div>
            <div className={classes.colorsContainer}>
                {Object.keys(COLORS).map((k) => {
                    return (<div 
                    key={k}
                    className= {cx(classes.colorBox, {[classes.activeColorBox] : strokeColor===COLORS[k]})}
                    style={{backgroundColor : COLORS[k]}}
                    onClick={() => changeStroke(activeToolItem, COLORS[k])}
                    ></div>)
                })}
            </div>
        </div>}

       {FILL_TOOL_TYPES.includes(activeToolItem) &&  <div className={classes.selectOptionContainer}>
            <div className={classes.toolBoxLevel}>Fill Color</div>
            <div className={classes.colorsContainer}>
                {Object.keys(COLORS).map((k) => {
                    return (<div 
                    key={k}
                    className= {cx(classes.colorBox, {[classes.activeColorBox] : fillColor===COLORS[k]})}
                    style={{backgroundColor : COLORS[k]}}
                    onClick={() => changeFill(activeToolItem, COLORS[k])}
                    ></div>)
                })}
            </div>
        </div>}
    </div>
  )
}

export default ToolBox;