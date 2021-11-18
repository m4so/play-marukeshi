import { useEffect, useState } from "react";

const useStatus = (willPlay, isSelected, lines) => {
  const [status, setStatus] = useState("");
  useEffect(() => {
    setStatus(() => {
      let numSelected = 0;
      isSelected.forEach((item) => {
        if (item) {
          numSelected += 1;
        }
      });
      if (numSelected === 16) {
        if (lines.length % 2 === 0) {
          return "WINNER: PLAYER1";
        } else {
          return "WINNER: PLAYER2";
        }
      }
      if (!willPlay) {
        return "PUSH PLAY";
      }
      if (lines.length % 2 === 0) {
        return "TURN: PLAYER1";
      } else {
        return "TURN: PLAYER2";
      }
    });
  }, [willPlay, isSelected]);
  return [status, setStatus];
};
export default useStatus;
