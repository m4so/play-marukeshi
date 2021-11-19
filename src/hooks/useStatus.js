import { useEffect, useState } from "react";
import { PLAY_MODE_AI, PLAY_MODE_NO, PLAY_MODE_OFFLINE } from "../consts";

const useStatus = (playMode, setPlayMode, isSelected, lines) => {
  const [status, setStatus] = useState("");
  useEffect(() => {
    setStatus(() => {
      if (isSelected === null) {
        setStatus("PUSH BUTTON TO PLAY");
        return;
      }
      if (playMode === PLAY_MODE_NO) {
        return;
      }
      let numSelected = 0;
      let text = "";
      isSelected.forEach((item) => {
        if (item) {
          numSelected += 1;
        }
      });
      if (numSelected == 16) {
        text = "WINNER: ";
      } else {
        text = "TURN: ";
      }
      if (playMode === PLAY_MODE_OFFLINE) {
        if (lines.length % 2 === 0) {
          text += "PLAYER1";
        } else {
          text += "PLAYER2";
        }
      }
      if (playMode === PLAY_MODE_AI) {
        if (lines.length % 2 === 0) {
          text += "YOU";
        } else {
          text += "AI";
        }
      }
      if (numSelected === 16) {
        setPlayMode(PLAY_MODE_NO);
      }
      setStatus(text);
    });
  }, [isSelected]);
  return [status, setStatus];
};
export default useStatus;
