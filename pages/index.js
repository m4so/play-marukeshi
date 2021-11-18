import Head from "next/head";
import { useEffect, useState } from "react";
import {
  useCanvas,
  useDotsToLine,
  useIsSelected,
  useLineToDots,
  useLineToValidLines,
  useWindowSize,
  useStatus,
} from "../src/hooks";
import useListLines from "../src/hooks/useListLines";

const Board = (props) => {
  let circleItems = [];
  for (let i = 0; i < 4; i++) {
    let circleItemsRow = [];
    for (let j = 0; j < 4; j++) {
      const index = i * 4 + j;
      let isBold = false;
      if (props.winnerLine != null) {
        isBold = props.winnerLine.includes(index);
      }
      if (props.isSelected[index]) {
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
    <div className="canvas-parent" class="flex justify-center">
      <canvas
        ref={props.canvasRef}
        onMouseDown={props.startDrawing}
        onMouseUp={props.finishDrawing}
      />
      <div>{circleItems}</div>
    </div>
  );
};

const Game = (props) => {
  return (
    <>
      <Board
        canvasRef={props.canvasRef}
        startDrawing={props.startDrawing}
        finishDrawing={props.finishDrawing}
        isSelected={props.isSelected}
      />
      <div class="mt-5 text-2xl md:text-3xl">
        <div>{props.status}</div>
      </div>
    </>
  );
};

export default function Home() {
  const [willPlay, setWillPlay] = useState(false);
  const lineToDots = useLineToDots();
  const dotsToLine = useDotsToLine();
  const lineToValidLines = useLineToValidLines();
  const windowSize = useWindowSize();
  const [canvasRef, ctxRef] = useCanvas(windowSize);
  const [offsetStartDrawing, setOffsetStartDrawing] = useState([-1, -1]);
  const [offsetFinishDrawing, setOffsetFinishDrawing] = useState([-1, -1]);
  const propsForListLines = {
    windowSize,
    ctxRef,
    offsetStartDrawing,
    setOffsetStartDrawing,
    offsetFinishDrawing,
    setOffsetFinishDrawing,
    dotsToLine,
    lineToValidLines,
    willPlay,
  };
  const [lines, setLines, validLines, setValidLines] =
    useListLines(propsForListLines);
  const [isSelected, setIsSelected] = useIsSelected(lines, lineToDots);
  useEffect(() => {
    let numSelected = 0;
    isSelected.forEach((item) => {
      if (item) {
        numSelected += 1;
      }
    });
    if (numSelected < 16) {
      return;
    }
    setWillPlay(false);
  }, [isSelected]);
  const [status, setStatus] = useStatus(willPlay, isSelected, lines);
  return (
    <>
      <Head>
        <title>marukeshi</title>
      </Head>
      <body class="text-green-900">
        <header class="text-4xl md:text-6xl">~MARUKESHI~</header>
        <nav>
          <button
            className="play-btn"
            onClick={() => {
              if (willPlay) {
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
              setWillPlay(true);
            }}
          >
            PLAY
          </button>
        </nav>
        <main>
          <Game
            canvasRef={canvasRef}
            startDrawing={({ nativeEvent }) => {
              const { offsetX, offsetY } = nativeEvent;
              setOffsetStartDrawing([offsetX, offsetY]);
            }}
            finishDrawing={({ nativeEvent }) => {
              const { offsetX, offsetY } = nativeEvent;
              setOffsetFinishDrawing([offsetX, offsetY]);
            }}
            isSelected={isSelected}
            status={status}
          />
        </main>
        <footer>
          <div>
            <u class="text-3xl md:text-5xl">Rule</u>
            <ol class="text-2xl md:text-3xl mt-6">
              <li class="mt-3">1. Draw lines from circle to circle</li>
              <li class="mt-3">
                2. You can't cross lines, or draw lines except horizontally,
                vertically and diagnally
              </li>
              <li class="mt-3">3. You lose if you take the last circle</li>
            </ol>
          </div>
          <div class="text-1xl md:text-2xl mt-6">
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
