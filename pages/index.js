import Head from "next/head";
import { useEffect, useState } from "react";
import { PLAY_MODE_NO, PLAY_MODE_OFFLINE, PLAY_MODE_AI } from "../src/consts";
import {
  useCanvas,
  useDotsToLine,
  useIsSelected,
  useLineToDots,
  useLineToValidLines,
  useWindowSize,
  useStatus,
  useModel,
  useLinesOffline,
  useLinesAi,
} from "../src/hooks";

const Board = (props) => {
  let circleItems = [];
  for (let i = 0; i < 4; i++) {
    let circleItemsRow = [];
    for (let j = 0; j < 4; j++) {
      const index = i * 4 + j;
      if (props.isSelected === null) {
        circleItemsRow.push(<div className="circle" key={index}></div>);
      } else if (props.isSelected[index]) {
        circleItemsRow.push(
          <div className="circle-selected" key={index}></div>
        );
      } else {
        circleItemsRow.push(<div className="circle" key={index}></div>);
      }
    }
    circleItems.push(
      <div className="game-board-row" key={i}>
        {circleItemsRow}
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <div className="canvas-parent">
        <canvas
          ref={props.canvasRef}
          onMouseDown={props.startDrawing}
          onMouseUp={props.finishDrawing}
          onTouchStart={props.startDrawing}
          onTouchEnd={props.finishDrawing}
        ></canvas>
        <div>{circleItems}</div>
      </div>
    </div>
  );
};

const ButtonOffline = (props) => {
  if (props.playMode === PLAY_MODE_OFFLINE) {
    return (
      <button className="play-btn-selected" onClick={props.onClick}>
        OFFLINE
      </button>
    );
  } else {
    return (
      <button className="play-btn" onClick={props.onClick}>
        OFFLINE
      </button>
    );
  }
};

const ButtonAi = (props) => {
  if (props.playMode === PLAY_MODE_AI) {
    return (
      <button className="play-btn-selected" onClick={props.onClick}>
        AI
      </button>
    );
  } else {
    return (
      <button className="play-btn" onClick={props.onClick}>
        AI
      </button>
    );
  }
};
export default function Home() {
  const [lines, setLines] = useState([]);
  const [validLines, setValidLines] = useState(Array(92).fill(1));
  const [playMode, setPlayMode] = useState(PLAY_MODE_NO);
  const [model, setModel] = useModel();
  const lineToDots = useLineToDots();
  const dotsToLine = useDotsToLine();
  const lineToValidLines = useLineToValidLines();
  const windowSize = useWindowSize();
  const [canvasRef, ctxRef] = useCanvas(windowSize);
  const [offsetStartDrawing, setOffsetStartDrawing] = useState([-1, -1]);
  const [offsetFinishDrawing, setOffsetFinishDrawing] = useState([-1, -1]);
  const propsForLines = {
    windowSize,
    ctxRef,
    offsetStartDrawing,
    setOffsetStartDrawing,
    offsetFinishDrawing,
    setOffsetFinishDrawing,
    dotsToLine,
    lineToValidLines,
    lineToDots,
    model,
    lines,
    setLines,
    validLines,
    setValidLines,
    playMode,
  };
  useLinesAi(propsForLines);
  useLinesOffline(propsForLines);
  const [isSelected, setIsSelected] = useIsSelected(lines, lineToDots);
  const [status, setStatus] = useStatus(
    playMode,
    setPlayMode,
    isSelected,
    lines
  );

  //callbacks
  const onClickOffline = () => {
    if (playMode !== PLAY_MODE_NO) {
      return;
    }
    if (canvasRef.current === null) {
      return;
    }
    setLines([]);
    setIsSelected(Array(16).fill(false));
    setValidLines(Array(92).fill(1));
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setPlayMode(PLAY_MODE_OFFLINE);
  };
  const onClickAi = () => {
    if (playMode !== PLAY_MODE_NO) {
      return;
    }
    if (canvasRef.current === null) {
      return;
    }
    setLines([]);
    setIsSelected(Array(16).fill(false));
    setValidLines(Array(92).fill(1));
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setPlayMode(PLAY_MODE_AI);
  };
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setOffsetStartDrawing([offsetX, offsetY]);
  };
  const finishDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setOffsetFinishDrawing([offsetX, offsetY]);
  };
  return (
    <>
      <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"></script>
      <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter"></script>
      <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"></script>
      <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose"></script>
      <Head>
        <title>marukeshi</title>
      </Head>
      <body className="text-green-900">
        <header className="text-4xl md:text-6xl">~MARUKESHI~</header>
        <nav>
          <ButtonOffline onClick={onClickOffline} playMode={playMode} />
          <ButtonAi onClick={onClickAi} playMode={playMode} />
        </nav>
        <main className="mt-6">
          <Board
            canvasRef={canvasRef}
            startDrawing={startDrawing}
            finishDrawing={finishDrawing}
            isSelected={isSelected}
          />
          <div className="mt-5 text-2xl md:text-3xl">{status}</div>
        </main>
        <footer>
          <div>
            <u className="text-3xl md:text-5xl">Rule</u>
            <ol className="text-2xl md:text-3xl mt-6">
              <li className="mt-3">1. Draw lines from circle to circle</li>
              <li className="mt-3">
                2. You can't cross lines, or draw lines except horizontally,
                vertically and diagnally
              </li>
              <li className="mt-3">3. You lose if you take the last circle</li>
            </ol>
          </div>
          <div className="text-1xl md:text-2xl mt-6">
            GitHub:{" "}
            <a href="https://github.com/m4so/play-marukeshi">
              https://github.com/m4so/play-marukeshi
            </a>
          </div>
        </footer>
      </body>
    </>
  );
}
