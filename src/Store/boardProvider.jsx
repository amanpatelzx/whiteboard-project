import React, { useReducer, useState } from 'react'
import boardContex from './board-context'
import rough from "roughjs/bin/rough"
import { TOOL_ITEMS } from '../constants'

const gen = rough.generator();
const boardReducer = (state, action)=>{
    switch (action.type){
        case "CHANGE_TOOL" :
            return {
                ...state,
                activeToolItem : action.payload.tool,
            };
        case "DRAW_DOWN" :
            const {clientX, clientY} = action.payload;
            const newElement = {
                id : state.elements.length,
                x1 : clientX,
                y1 : clientY,
                x2 : clientX,
                y2 : clientY,
                roughEle : gen.line(clientX, clientY, clientX, clientY),
            }
            const prevElement = state.elements;
            return {
                ...state,
                elements: [...prevElement, newElement],
            }
        default:
            return state;
    }
};
const initialBoardState = {
    activeToolItem : TOOL_ITEMS.LINE,
    elements : [],
};
const boardProvider = ({children}) => {
    const [boardState, dispatchBoardAction] = useReducer(boardReducer, initialBoardState);
    // const [activeToolItem, setActiveToolItem] = useState(TOOL_ITEMS.LINE);
    // const [elements, setElements] = useState([]);

    const handleToolItemClick = (tool) =>{
        dispatchBoardAction({type: "CHANGE_TOOL", payload:{
            tool,
        },})
    }
    const boardMouseDownHandler = (event) =>{
        const {clientX, clientY} = event;
        const roughEle = gen.line(clientX, clientY, clientX, clientY);
        dispatchBoardAction({
            type: "DRAW_DOWN",
            payload:{
                clientX,
                clientY,
            },
        });
    };
    const boardContextValue = {
        activeToolItem : boardState.activeToolItem,
        elements : boardState.elements,
        handleToolItemClick,
        boardMouseDownHandler,
    };


  return (
    <boardContex.Provider value={boardContextValue}>
        {children}
    </boardContex.Provider>
  )
}   

export default boardProvider