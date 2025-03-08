
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import Viewer from './pages/viewer'
import { ThemeProvider, createTheme } from '@mui/material/styles';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


function App() {
  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
      <Viewer/>
    </ThemeProvider>
  )
}

export default App




