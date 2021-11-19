import { useEffect, useState } from "react";

const useIsSelected = (lines, lineToDots) => {
  const [isSelected, setIsSelected] = useState(null);
  useEffect(() => {
    if (isSelected == null) {
      return;
    }
    setIsSelected((prevArray) => {
      let array = prevArray.slice();
      lines.forEach((line) => {
        let dot;
        for (var i = 0; i < 4; i++) {
          dot = lineToDots[line * 4 + i];
          if (dot != -1) {
            array[dot] = true;
          }
        }
      });
      return array;
    });
  }, [lines, lineToDots]);
  return [isSelected, setIsSelected];
};
export default useIsSelected;
