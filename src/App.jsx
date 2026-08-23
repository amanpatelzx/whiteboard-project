import { useEffect, useRef } from "react";
import Board from "./board";
import ToolBar from "./ToolBar";
import BoardProvider from "./Store/boardProvider";
function App() {
  return (
    <>
      <BoardProvider>
        <ToolBar/>
        <Board/>
      </BoardProvider>
    </>
  );
}

export default App;
