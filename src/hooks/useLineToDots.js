import { useEffect, useState } from "react";
import npyjs from "npyjs";

const useLineToDots = () => {
  const [lineToDots, setLineToDots] = useState();

  useEffect(async () => {
    let n = new npyjs();
    const npyArray = await n.load("/npy/line2dots.npy");
    setLineToDots(npyArray.data);
  }, []);
  return lineToDots;
};
export default useLineToDots;
