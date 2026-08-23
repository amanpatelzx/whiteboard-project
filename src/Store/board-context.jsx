import { createContext } from "react";

const boardContext = createContext({
    activeToolItem : "",
    elements : [],
    handleToolItemClick : () => {},
    boardMouseDownHandler : () => {},

});

export default boardContext;