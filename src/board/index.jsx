import { useContext, useEffect, useRef } from "react";
import boardContext from "../Store/board-context";
import rough from 'roughjs';
import classes from "./index.module.css"
import { TOOL_ACTION_TYPES } from "../constants";
function Board() {
  const canvasRef = useRef();
  const {elements, boardMouseDownHandler, boardMouseMoveHandler ,boardMouseUpHandler, toolActionType} = useContext(boardContext);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height=  window.innerHeight;
  
  }, [elements])
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save(); 
    let roughCanvas = rough.canvas(canvas);
    // let generator = roughCanvas.generator;

    // let rect1 = generator.rectangle(10, 10, 100, 100);
    // let rect2 = generator.rectangle(10, 120, 100, 100, {fill: 'red'});

    // roughCanvas.draw(rect1);
    // roughCanvas.draw(rect2);
    elements.forEach(element => {
      roughCanvas.draw(element.roughEle);
    });

    return () =>{
      context.clearRect(0 , 0 , canvas.width, canvas.height);
    }
  }, [elements])

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
