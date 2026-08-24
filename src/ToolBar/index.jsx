import React, { useContext } from 'react'
import classes from "./index.module.css"
import cx from "classnames"
import { FaSlash } from "react-icons/fa";
import { LuRectangleHorizontal } from 'react-icons/lu'
import { FaRegCircle } from "react-icons/fa";
import { TbOvalVertical } from "react-icons/tb";
import boardContex from '../Store/board-context';
import { TOOL_ITEMS } from '../constants';
const ToolBar = () => {
    const {activeToolItem, changeToolHandler} = useContext(boardContex);
    return (
        <div className={classes.container}>
            <div className={
                cx(classes.toolItem, {[classes.active] : activeToolItem === "LINE"})
            }
            onClick={() => changeToolHandler(TOOL_ITEMS.LINE)}
            >
            <FaSlash />
            </div>
            <div className={
                cx(classes.toolItem, {[classes.active] : activeToolItem === "RECTANGLE"})
            }
            onClick={() => changeToolHandler(TOOL_ITEMS.RECTANGLE)}
            >
                <LuRectangleHorizontal/>
            </div>
            <div className={
                cx(classes.toolItem, {[classes.active] : activeToolItem === "CIRCLE"})
            }
            onClick={() => changeToolHandler(TOOL_ITEMS.CIRCLE)}
            >
                <FaRegCircle/>
            </div>
            <div className={
                cx(classes.toolItem, {[classes.active] : activeToolItem === "ELLIPSE"})
            }
            onClick={() => changeToolHandler(TOOL_ITEMS.ELLIPSE )}
            >
                <TbOvalVertical/>
            </div>
        </div>
    );
}

export default ToolBar;