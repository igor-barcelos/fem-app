
import './App.css'
import { Scene } from './three/scene/Scene'
import { useEffect } from 'react'
function App() {
  const scene = new Scene() 
  useEffect(() => {
    scene.init()
    scene.loadToolBar()
  }, []);
  return (
    <>
    </>
  )
}

export default App




