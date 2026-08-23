import React, { useContext } from 'react'
import classes from "./index.module.css"
import cx from "classnames"
import { FaSlash } from "react-icons/fa";
import { LuRectangleHorizontal } from 'react-icons/lu'
import boardContex from '../Store/board-context';
import { TOOL_ITEMS } from '../constants';
const ToolBar = () => {
    const {activeToolItem, handleToolItemClick} = useContext(boardContex);
    return (
        <div className={classes.container}>
            <div className={
                cx(classes.toolItem, {[classes.toolItem.active] : activeToolItem === "LINE"})
            }
            onClick={() => handleToolItemClick(TOOL_ITEMS.LINE)}
            >
            <FaSlash />
            </div>
            <div className={
                cx(classes.toolItem, {[classes.toolItem.active] : activeToolItem === "RECTANGLE"})
            }
            onClick={() => handleToolItemClick(TOOL_ITEMS.RECTANGLE)}
            >
                <LuRectangleHorizontal/>
            </div>
        </div>
    );
}

export default ToolBar;