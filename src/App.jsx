import { useEffect, useRef } from "react";
import Board from "./board";
import ToolBar from "./ToolBar";
import boardProvider from "./Store/boardProvider";
function App() {
  return (
    <>
      <boardProvider>
        <Board/>
        <ToolBar/>
      </boardProvider>
    </>
  );
}

export default App;
