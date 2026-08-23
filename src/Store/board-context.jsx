import { createContext } from "react";

const BoardContext = createContext({
    activeToolItem : "",
    elements : [],
    handleToolItemClick : () => {},
    boardMouseDownHandler : () => {},

});

export default BoardContext;