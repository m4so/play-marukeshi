import { useEffect, useState } from "react";
import npyjs from "npyjs";

const useDotsToLine = () => {
  const [dotsToLine, setDotsToLine] = useState();
  useEffect(async () => {
    let n = new npyjs();
    const npyArray = await n.load("/npy/dots2line.npy");
    setDotsToLine(npyArray.data);
  }, []);
  return dotsToLine;
};
export default useDotsToLine;
