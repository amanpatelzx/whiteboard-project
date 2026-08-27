import React, { useContext } from 'react'
import classes from "./index.module.css"
import cx from "classnames"
import { FaEraser, FaPaintBrush, FaSlash } from "react-icons/fa";
import { LuRectangleHorizontal } from 'react-icons/lu'
import { FaRegCircle } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { TbOvalVertical } from "react-icons/tb";
import boardContex from '../Store/board-context';
import { TOOL_ITEMS } from '../constants';
const ToolBar = () => {
    const {activeToolItem, changeToolHandler} = useContext(boardContex);
    return (
        <div className={classes.container}>
            <div className={
                cx(classes.toolItem, {[classes.active] : activeToolItem === TOOL_ITEMS.BRUSH})
            }
            onClick={() => changeToolHandler(TOOL_ITEMS.BRUSH)}
            >
            <FaPaintBrush />
            </div>

            <div className={
                cx(classes.toolItem, {[classes.active] : activeToolItem === TOOL_ITEMS.LINE})
            }
            onClick={() => changeToolHandler(TOOL_ITEMS.LINE)}
            >
            <FaSlash />
            </div>

            <div className={
                cx(classes.toolItem, {[classes.active] : activeToolItem === TOOL_ITEMS.RECTANGLE})
            }
            onClick={() => changeToolHandler(TOOL_ITEMS.RECTANGLE)}
            >
                <LuRectangleHorizontal/>
            </div>
            <div className={
                cx(classes.toolItem, {[classes.active] : activeToolItem === TOOL_ITEMS.CIRCLE})
            }
            onClick={() => changeToolHandler(TOOL_ITEMS.CIRCLE)}
            >
                <FaRegCircle/>
            </div>
            <div className={
                cx(classes.toolItem, {[classes.active] : activeToolItem === TOOL_ITEMS.ELLIPSE})
            }
            onClick={() => changeToolHandler(TOOL_ITEMS.ELLIPSE )}
            >
                <TbOvalVertical/>
            </div>
            <div className={
                cx(classes.toolItem, {[classes.active] : activeToolItem === TOOL_ITEMS.ARROW})
            }
            onClick={() => changeToolHandler(TOOL_ITEMS.ARROW )}
            >
                <FaArrowRight />
            </div>

            <div className={
                cx(classes.toolItem, {[classes.active] : activeToolItem === TOOL_ITEMS.ERASER})
            }
            onClick={() => changeToolHandler(TOOL_ITEMS.ERASER )}
            >
                <FaEraser />
            </div>
        </div>
    );
}

export default ToolBar;