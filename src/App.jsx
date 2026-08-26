import { useEffect, useRef } from "react";
import Board from "./board";
import ToolBar from "./ToolBar";
import ToolBox from "./ToolBox";
import BoardProvider from "./Store/boardProvider";
import ToolboxProvider from "./Store/toolboxProvider";
function App() {
  return (
    <>
      <BoardProvider>
        <ToolboxProvider>
            <ToolBar/>
            <Board/>
            <ToolBox/>
        </ToolboxProvider>
      </BoardProvider>
    </>
  );
}

export default App;
