import { useContext, useEffect, useRef } from "react";
import boardContext from "../Store/board-context";
import rough from 'roughjs';
import classes from "./index.module.css"
function Board() {
  const canvasRef = useRef();
  const {elements, boardMouseDownHandler } = useContext(boardContext);
  
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

  const handleBoardMouseDown = (event) => {
      boardMouseDownHandler(event);
  };
  return (
    <canvas ref={canvasRef} onMouseDown={handleBoardMouseDown} />
  );
}

export default Board;
