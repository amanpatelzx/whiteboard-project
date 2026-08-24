import { createContext } from "react";

const BoardContext = createContext({
    activeToolItem : "",
    toolActionType : "",
    elements : [],
    changeToolHandler : () => {},
    boardMouseDownHandler : () => {},
    boardMouseMoveHandler : () => {},
    boardMouseUpHandler : () => {},

});

export default BoardContext;