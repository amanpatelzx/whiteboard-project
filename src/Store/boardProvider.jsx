import React, { useReducer, useState } from 'react'
import boardContex from './board-context'
import rough from "roughjs/bin/rough"
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from '../constants'
import { createRoughElement } from '../utils/elements';

const gen = rough.generator();
const boardReducer = (state, action)=>{
    switch (action.type){
        case BOARD_ACTIONS.CHANGE_TOOL :{
            return {
                ...state,
                activeToolItem : action.payload.tool,
            };
        }
            
        case BOARD_ACTIONS.DRAW_DOWN :{
            const {clientX, clientY} = action.payload;
            const newElement = createRoughElement(
                state.elements.length,
                clientX,
                clientY,
                clientX,
                clientY,
                {type : state.activeToolItem},
            );
            const prevElement = state.elements;
            return {
                ...state,
                toolActionType : TOOL_ACTION_TYPES.DRAWING,
                elements: [...prevElement, newElement],
            }
        }
            
        case BOARD_ACTIONS.DRAW_MOVE: {
            const { clientX, clientY } = action.payload;
            const idx = state.elements.length - 1;
            if (idx < 0) {
                return state;
            }

            const newElements = [...state.elements];

            newElements[idx].x2 = clientX;
            newElements[idx].y2 = clientY;

            // newElements[idx].roughEle = gen.line(
            //     newElements[idx].x1,
            //     newElements[idx].y1,
            //     clientX,
            //     clientY,
            // );  
            const newElement = createRoughElement(
                state.elements.length,
                newElements[idx].x1,
                newElements[idx].y1,
                clientX,
                clientY,
                {type : state.activeToolItem},
            )
            newElements[idx] = newElement;
            return {
                ...state,
                elements: newElements,
            };
        }
        case BOARD_ACTIONS.DRAW_UP: {
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
        dispatchBoardAction({type: BOARD_ACTIONS.CHANGE_TOOL, payload:{
            tool,
        },})
    }

    const boardMouseDownHandler = (event) =>{
        const {clientX, clientY} = event;
        // const roughEle = gen.line(clientX, clientY, clientX, clientY);
        dispatchBoardAction({
            type: BOARD_ACTIONS.DRAW_DOWN,
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
            type: BOARD_ACTIONS.DRAW_MOVE,
            payload:{
                clientX,
                clientY,
            },
        });
    };

    const boardMouseUpHandler = () =>{
        dispatchBoardAction({
            type: BOARD_ACTIONS.DRAW_UP,
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