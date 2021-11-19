import { useRef, useEffect } from "react";
import { BOARDER_SMALL, CANVAS, CANVAS_SMALL } from "../consts";

useRef;
const useCanvas = (windowSize) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    const ctx = canvas.getContext("2d");
    // set line stroke and line width
    let size = -1;
    if (windowSize.width < BOARDER_SMALL) {
      size = CANVAS_SMALL;
    } else {
      size = CANVAS;
    }
    canvas.width = size;
    canvas.height = size;

    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 10;
    ctxRef.current = ctx;
  }, [windowSize]);
  return [canvasRef, ctxRef];
};
export default useCanvas;
