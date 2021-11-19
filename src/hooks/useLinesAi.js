import { getFontDefinitionFromManifest } from "next/dist/server/font-utils";
import { useEffect, useState } from "react";
import {
  BOARDER_SMALL,
  MARGIN_SMALL,
  PLAY_MODE_AI,
  PLAY_MODE_OFFLINE,
  RADIUS_SMALL,
} from "../consts";

const getCircleId1d = (offset, radius, margin) => {
  let circleId1d = -1;
  const div = offset / (2 * (radius + margin));
  const difference = Math.abs(div - Math.floor(div) - 0.5);
  if (difference < (radius * 0.8) / (2 * (radius + margin))) {
    circleId1d = Math.floor(div);
  }
  return circleId1d;
};

const getCircleId = (offset, windowSize) => {
  const [offsetX, offsetY] = offset;
  let circleId = -1;
  let radius, margin;
  if (windowSize.width < BOARDER_SMALL) {
    radius = RADIUS_SMALL;
    margin = MARGIN_SMALL;
  } else {
    radius = RADIUS;
    margin = MARGIN;
  }
  const circleIdX = getCircleId1d(offsetX, radius, margin);
  if (circleIdX < 0) {
    return circleId;
  }
  const circleIdY = getCircleId1d(offsetY, radius, margin);
  if (circleIdY < 0) {
    return circleId;
  }
  circleId = circleIdX + 4 * circleIdY;
  return circleId;
};
const getOffset = (circleId, windowSize) => {
  let circleIdX = circleId % 4;
  let circleIdY = (circleId - circleIdX) / 4;
  let radius, margin;
  if (windowSize.width < BOARDER_SMALL) {
    radius = RADIUS_SMALL;
    margin = MARGIN_SMALL;
  } else {
    radius = RADIUS;
    margin = MARGIN;
  }
  let unit = radius + margin;
  return [unit * (1 + 2 * circleIdX), unit * (1 + 2 * circleIdY)];
};
function argMax(array) {
  if (array.length === 0) {
    return -1;
  }
  let max = array[0];
  let argmax = 0;
  array.forEach((element, index) => {
    if (element > max) {
      max = element;
      argmax = index;
    }
  });
  return argmax;
}

const useLinesAi = (props) => {
  const {
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
    playMode,
    lines,
    setLines,
    validLines,
    setValidLines,
    ...rest
  } = props;

  useEffect(() => {
    if (playMode !== PLAY_MODE_AI) {
      return;
    }
    if (offsetFinishDrawing[0] < 0 || offsetStartDrawing[0] < 0) {
      return;
    }
    if (dotsToLine === undefined || lineToValidLines === undefined) {
      return;
    }
    if (lines.length % 2 === 1) {
      return;
    }
    if (offsetFinishDrawing[0] >= 0) {
      // save state
      const start = getCircleId(offsetStartDrawing, windowSize);
      const end = getCircleId(offsetFinishDrawing, windowSize);
      if (start < 0 || end < 0) {
        return;
      }
      const line = dotsToLine[start * 16 + end];
      // is valid line
      if (line === -1) {
        return;
      }
      if (validLines[line] === 0) {
        return;
      }
      //set state
      setLines((prevArray) => [...prevArray, line]);
      setValidLines((prevArray) => {
        let array = prevArray.slice();
        for (var i = 0; i < 92; i++) {
          array[i] *= lineToValidLines[line * 92 + i];
        }
        return array;
      });
      //draw line
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(offsetStartDrawing[0], offsetStartDrawing[1]);
      ctxRef.current.lineTo(offsetFinishDrawing[0], offsetFinishDrawing[1]);
      ctxRef.current.stroke();
    }
    // init
    setOffsetStartDrawing([-1, -1]);
    setOffsetFinishDrawing([-1, -1]);
  }, [offsetFinishDrawing, dotsToLine, lineToValidLines, playMode]);

  useEffect(async () => {
    if (model === undefined || lineToDots === undefined) {
      return;
    }
    if (playMode !== PLAY_MODE_AI) {
      return;
    }
    if (lines.length % 2 === 0) {
      return;
    }
    const L = lines.length + 1;
    let xs = [92, ...lines];
    for (var i = 0; i < L; i++) {
      xs[i] += 1;
    }
    const t2d = tf.tensor2d([xs], [1, L]);
    model.executeAsync(t2d).then((predictions) => {
      const data = predictions.dataSync();
      const data92 = data.slice(93 * (L - 1) + 1, 93 * L); // you can also use arraySync or their equivalents async methods
      const line = argMax(data92);
      console.log("pred", line);

      // set state
      setLines((prevArray) => [...prevArray, line]);
      setValidLines((prevArray) => {
        let array = prevArray.slice();
        for (var i = 0; i < 92; i++) {
          array[i] *= lineToValidLines[line * 92 + i];
        }
        return array;
      });
      //draw line
      let start = lineToDots[4 * line + 0];
      let finish;
      for (var i = 0; i < 4; i++) {
        let dot = lineToDots[4 * line + i];
        if (dot != -1) {
          finish = dot;
        }
      }
      const startOffset = getOffset(start, windowSize);
      console.log(start, startOffset);
      const finishOffset = getOffset(finish, windowSize);
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(startOffset[0], startOffset[1]);
      ctxRef.current.lineTo(finishOffset[0], finishOffset[1]);
      ctxRef.current.stroke();
    });
  }, [lines]);
};
export default useLinesAi;
