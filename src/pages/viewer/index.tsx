import { useEffect, useRef, useState} from "react";
import { Model } from "../../model/Model";
import NavBar from "../../components/NavBar/NavBar";
import { ModelContext } from "../../model/Context";
import Elements from "../../components/Elements/Elements";
import LevelSelector from "../../components/Levels/Components/Selector";
const Viewer = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);  
  const modelRef = useRef<Model | null>(null)
  const [model, setModel] = useState<Model | null>(null)

  useEffect(() => {
    modelRef.current = new Model()
    setModel(modelRef.current)
    return () => {
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, []);

  
  return (
    <div id="app-container" ref={containerRef} style={{position:'relative', width:'100vw', height:'100vh', overflow: 'hidden',  margin: '0px'}} >
      <ModelContext.Provider value={model}>
        <NavBar/>
        <Elements/>
      </ModelContext.Provider>
    </div>
  );
};

export default Viewer;