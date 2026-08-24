import React, { useReducer, useState } from 'react'
import boardContex from './board-context'
import rough from "roughjs/bin/rough"
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from '../constants'

const gen = rough.generator();
const boardReducer = (state, action)=>{
    switch (action.type){
        case "CHANGE_TOOL" :{
            return {
                ...state,
                activeToolItem : action.payload.tool,
            };
        }
            
        case "DRAW_DOWN" :{
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
                toolActionType : TOOL_ACTION_TYPES.DRAWING,
                elements: [...prevElement, newElement],
            }
        }
            
        case "DRAW_MOVE": {
            const { clientX, clientY } = action.payload;
            const idx = state.elements.length - 1;
            if (idx < 0) {
                return state;
            }

            const newElements = [...state.elements];

            newElements[idx].x2 = clientX;
            newElements[idx].y2 = clientY;

            newElements[idx].roughEle = gen.line(
                newElements[idx].x1,
                newElements[idx].y1,
                clientX,
                clientY,
            );

            return {
                ...state,
                elements: newElements,
            };
        }
        case "DRAW_UP": {
            return{
                ...state,
                toolActionType: TOOL_ACTION_TYPES.NONE,
            }
        }
        default:
            return state;
    }
};
const initialBoardState = {
    activeToolItem : TOOL_ITEMS.LINE,
    toolActionType : TOOL_ACTION_TYPES.NONE, 
    elements : [],
};
const BoardProvider = ({children}) => {
    const [boardState, dispatchBoardAction] = useReducer(boardReducer, initialBoardState);
    // const [activeToolItem, setActiveToolItem] = useState(TOOL_ITEMS.LINE);
    // const [elements, setElements] = useState([]);

    const changeToolHandler = (tool) =>{
        dispatchBoardAction({type: "CHANGE_TOOL", payload:{
            tool,
        },})
    }

    const boardMouseDownHandler = (event) =>{
        const {clientX, clientY} = event;
        // const roughEle = gen.line(clientX, clientY, clientX, clientY);
        dispatchBoardAction({
            type: "DRAW_DOWN",
            payload:{
                clientX,
                clientY,
            },
        });
    };

    const boardMouseMoveHandler = (event) =>{
        const {clientX, clientY} = event;
        // const roughEle = gen.line(clientX, clientY, clientX, clientY);
        dispatchBoardAction({
            type: "DRAW_MOVE",
            payload:{
                clientX,
                clientY,
            },
        });
    };

    const boardMouseUpHandler = () =>{
        dispatchBoardAction({
            type: "DRAW_UP",
        });
    };
    const boardContextValue = {
        activeToolItem : boardState.activeToolItem,
        elements : boardState.elements,
        toolActionType : boardState.toolActionType,
        changeToolHandler,
        boardMouseDownHandler,
        boardMouseMoveHandler,
        boardMouseUpHandler,
    };


  return (
    <boardContex.Provider value={boardContextValue}>
        {children}
    </boardContex.Provider>
  )
}   

export default BoardProvider;