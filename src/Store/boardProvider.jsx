import React, { useContext, useReducer, useState } from 'react'
import boardContex from './board-context'
import rough from "roughjs/bin/rough"
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from '../constants'
import { createElement } from '../utils/elements';
import { getSvgPathFromStroke } from '../utils/elements';
import { isPointNearElement } from '../utils/elements';
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

        case BOARD_ACTIONS.CHANGE_ACTION_TYPE :{
            return {
                ...state,
                toolActionType : action.payload.actionType,
            };
        }
            
        case BOARD_ACTIONS.DRAW_DOWN :{
            const {clientX, clientY, stroke , fill, size} = action.payload;
            const newElement = createElement(
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
                toolActionType : state.activeToolItem === TOOL_ITEMS.TEXT 
                    ? TOOL_ACTION_TYPES.WRITING 
                    : TOOL_ACTION_TYPES.DRAWING,
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
                case TOOL_ITEMS.ELLIPSE:
                const { x1, y1, stroke, fill, size } = newElements[index];
                const newElement = createElement(index, x1, y1, clientX, clientY, {
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
        case BOARD_ACTIONS.DRAW_UP : {
            const elementCopy = [...state.elements];
            const newHistory = state.history.slice(0, state.index+1);
            newHistory.push(elementCopy);
            return {
                ...state,
                history : newHistory,
                index : state.index + 1,
            }
        }
        case BOARD_ACTIONS.ERASE: {
            const {clientX, clientY} = action.payload;
            let newElements = [...state.elements];
            newElements = newElements.filter((element) =>{
                return !isPointNearElement(element, clientX, clientY);
            });
            // const newHistory = state.history.slice(0, state.index+1);
            // newHistory.push(newElements);
            return {
                ...state,
                elements : newElements,
                // history : newHistory,
                // index : state.index + 1,
            }
        }
        case BOARD_ACTIONS.CHANGE_TEXT:{
            const idx = state.elements.length-1;
            const newElements = [...state.elements];
            newElements[idx].text = action.payload.text;
            const newHistory = state.history.slice(0, state.index+1);
            newHistory.push(newElements);
            return{
                ...state,
                toolActionType : TOOL_ACTION_TYPES.NONE,
                elements : newElements,
                history: newHistory,
                index : state.index + 1,
            }
        }

        case BOARD_ACTIONS.UNDO : {
            const currIdx = state.index;
            if(currIdx > 0){
                const newElement = state.history[currIdx-1];
                return {
                    ...state,
                    elements : newElement,
                    index : currIdx - 1,
                }
            }
            else return state;
        }

        case BOARD_ACTIONS.REDO : {
            const currIdx = state.index;
            const maxIdx = state.history.length;

            if(currIdx + 1 < maxIdx){
                const newElement = state.history[currIdx+1];
                return {
                    ...state,
                    elements : newElement,
                    index : currIdx + 1,
                }
            }
            else return state;
        }
        default:
            return state;
    }
};
const initialBoardState = {
    activeToolItem : TOOL_ITEMS.LINE,
    toolActionType : TOOL_ACTION_TYPES.NONE, 
    elements : [],
    history : [[]],
    index : 0,
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
        
        // if(boardState.activeToolItem === TOOL_ITEMS.TEXT){
        //     dispatchBoardAction({
        //         type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        //         payload:{
        //             actionType: TOOL_ACTION_TYPES.WRITING,
        //         }
        //     });
        //     return;
        // }
        if(boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return; 

        if(boardState.activeToolItem === TOOL_ITEMS.ERASER){
            dispatchBoardAction({
                type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
                payload:{
                    actionType : TOOL_ACTION_TYPES.ERASING,
                }
            })
            return;
        }
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
        if(boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;

        // const roughEle = gen.line(clientX, clientY, clientX, clientY);
        if(boardState.toolActionType  === TOOL_ACTION_TYPES.DRAWING){
            dispatchBoardAction({
                type: BOARD_ACTIONS.DRAW_MOVE,
                payload:{
                    clientX,
                    clientY,
                },
            });
        }
        else if(boardState.toolActionType  === TOOL_ACTION_TYPES.ERASING){
            dispatchBoardAction({
                type:BOARD_ACTIONS.ERASE,
                payload:{
                    clientX,
                    clientY
                }
            })
        }
    };

    const boardMouseUpHandler = () =>{
        if(boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return; 
        if(boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING){
            dispatchBoardAction({
                type: BOARD_ACTIONS.DRAW_UP,
            })
        } 
        dispatchBoardAction({
            type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
            payload:{
                actionType : TOOL_ACTION_TYPES.NONE,
            }
        });
    };

    const textAreaBlurHandler = (text, toolboxState) => {
        dispatchBoardAction({
            type : BOARD_ACTIONS.CHANGE_TEXT,
            payload: {
                text,
            }
        })
    }

    const boardUndoHandler = () => {
        dispatchBoardAction({
            type : BOARD_ACTIONS.UNDO,
        });
    };

    const boardRedoHandler = () => {
        dispatchBoardAction({
            type : BOARD_ACTIONS.REDO,
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
        textAreaBlurHandler,
        undo : boardUndoHandler,
        redo : boardRedoHandler,
    };


  return (
    <boardContex.Provider value={boardContextValue}>
        {children}
    </boardContex.Provider>
  )
}   

export default BoardProvider;