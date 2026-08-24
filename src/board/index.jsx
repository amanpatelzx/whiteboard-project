import { useContext, useLayoutEffect, useRef } from "react";
import boardContext from "../Store/board-context";
import rough from 'roughjs';
import classes from "./index.module.css"
import { TOOL_ACTION_TYPES } from "../constants";
function Board() {
  const canvasRef = useRef();
  const {elements, boardMouseDownHandler, boardMouseMoveHandler ,boardMouseUpHandler, toolActionType} = useContext(boardContext);
  
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height=  window.innerHeight;
  
  }, [elements]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save(); 
    let roughCanvas = rough.canvas(canvas);
   
    elements.forEach(element => {
      roughCanvas.draw(element.roughEle);
    });

    return () =>{
      context.clearRect(0 , 0 , canvas.width, canvas.height);
    }
  }, [elements]);

  const handleMouseDown = (event) => {
      boardMouseDownHandler(event);
  };
  const handleMouseMove = (event) => {
    if(toolActionType === TOOL_ACTION_TYPES.DRAWING) boardMouseMoveHandler(event);
  };
  const handleMouseUp = () => {
    boardMouseUpHandler();
  };
  return (
    <canvas ref={canvasRef} onMouseDown={handleMouseDown} 
    onMouseMove={handleMouseMove}
     onMouseUp={handleMouseUp} />
  );
}

export default Board;
