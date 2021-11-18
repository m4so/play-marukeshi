import { useRef, useEffect } from "react";

useRef;
const useCanvas = (windowSize) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // set line stroke and line width
    let size = -1;
    if (windowSize.width < 768) {
      size = 336;
    } else {
      size = 504;
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
