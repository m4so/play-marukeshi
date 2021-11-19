import { loadGraphModel } from "@tensorflow/tfjs-converter";
import { useState, useEffect } from "react";

const useModel = () => {
  const [model, setModel] = useState();
  useEffect(async () => {
    const MODEL_URL = "/web_models/NumEpisodes1e6/model.json";
    const model = await loadGraphModel(MODEL_URL);
    setModel(model);
  }, []);
  return [model, setModel];
};
export default useModel;
