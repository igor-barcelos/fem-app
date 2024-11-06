import { useEffect, useRef} from "react";
import { Model } from "../../model/src/Model";
import BottomBar from "../../components/BottomBar/BottomBar";
import { useAppContext } from "../../App";
const Viewer = () => {

  const containerRef = useRef<HTMLDivElement | null>(null);  
  const modelRef = useRef<Model | null>(null)
  const state = useAppContext();
  
  useEffect(() => {
    modelRef.current = new Model(state)
    return () => {
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, []);

  
  return (
    <div id="app-container" ref={containerRef} style={{position:'relative', width:'100vw', height:'100vh', overflow: 'hidden',  margin: '0px'}} >
      <div style={{position:'absolute', bottom : '0px', left: '50%',  transform: 'translateX(-50%)'}}>
        <BottomBar/> 
      </div>
    </div>
  );
};

export default Viewer;