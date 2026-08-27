import React, { useContext, useReducer, useState } from 'react'
import boardContex from './board-context'
import rough from "roughjs/bin/rough"
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from '../constants'
import { createRoughElement } from '../utils/elements';
import { getSvgPathFromStroke } from '../utils/elements';
import getStroke from 'perfect-freehand';
import toolboxContext from './toolbox-context';

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
            const {clientX, clientY, stroke , fill, size} = action.payload;
            const newElement = createRoughElement(
                state.elements.length,
                clientX,
                clientY,
                clientX,
                clientY,
                {type : state.activeToolItem, stroke, fill, size},
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
            const newElements = [...state.elements];
            const index = state.elements.length - 1;
            const { type } = newElements[index];
            switch (type) {
                case TOOL_ITEMS.LINE:
                case TOOL_ITEMS.RECTANGLE:
                case TOOL_ITEMS.CIRCLE:
                case TOOL_ITEMS.ARROW:
                const { x1, y1, stroke, fill, size } = newElements[index];
                const newElement = createRoughElement(index, x1, y1, clientX, clientY, {
                    type: state.activeToolItem,
                    stroke,
                    fill,
                    size,
                });
                newElements[index] = newElement;
                return {
                    ...state,
                    elements: newElements,
                };
                case TOOL_ITEMS.BRUSH:
                newElements[index].points = [
                    ...newElements[index].points,
                    { x: clientX, y: clientY },
                ];
                newElements[index].path = new Path2D(
                    getSvgPathFromStroke(getStroke(newElements[index].points))
                );
                return {
                    ...state,
                    elements: newElements,
                };
                default:
                throw new Error("Type not recognized");
            }
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

    const boardMouseDownHandler = (event, toolboxState) =>{
        const {clientX, clientY} = event;
        // const roughEle = gen.line(clientX, clientY, clientX, clientY);
        dispatchBoardAction({
            type: BOARD_ACTIONS.DRAW_DOWN,
            payload:{
                clientX,
                clientY,
                stroke : toolboxState[boardState.activeToolItem]?.stroke,
                fill : toolboxState[boardState.activeToolItem]?.fill,
                size : toolboxState[boardState.activeToolItem]?.size,
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