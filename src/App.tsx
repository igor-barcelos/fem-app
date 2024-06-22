
import './App.css'
import { Viewer } from './pages/viewer/Viewer'
import { useEffect } from 'react'
function App() {
  const viewer = new Viewer() 
  useEffect(() => {
    viewer.init()
  }, []);
  return (
    <>
    </>
  )
}

export default App




