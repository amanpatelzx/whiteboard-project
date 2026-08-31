import { createContext } from "react";

const BoardContext = createContext({
    activeToolItem : "",
    toolActionType : "",
    elements : [],
    history : [[]],
    index : 0,
    changeToolHandler : () => {},
    boardMouseDownHandler : () => {},
    boardMouseMoveHandler : () => {},
    boardMouseUpHandler : () => {},
    textAreaBlurHandler : () => {},
    undo : () =>{},
    redo : () =>{},

});

export default BoardContext;