import { useEffect, useState } from "react";
import npyjs from "npyjs";

const useLineToValidLines = () => {
  const [lineToValidLines, setLineToValidLines] = useState();
  useEffect(async () => {
    let n = new npyjs();
    const npyArray = await n.load("/npy/line2valid_lines.npy");
    setLineToValidLines(npyArray.data);
  }, []);
  return lineToValidLines;
};
export default useLineToValidLines;
