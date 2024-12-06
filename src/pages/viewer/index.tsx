import { useEffect, useRef,  createContext, useContext, useState} from "react";
import { Model } from "../../model/Model";
import NavBar from "../../components/NavBar/NavBar";
import { ModelContext } from "../../model/Context";
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
      </ModelContext.Provider>
      {/* <div style={{position:'absolute', bottom : '0px', left: '50%',  transform: 'translateX(-50%)'}}>
        <BottomBar/> 
      </div> */}
    </div>
  );
};

export default Viewer;