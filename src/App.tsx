
import './App.css'
import Viewer from './pages/viewer'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createContext, ReactNode, useContext } from 'react';
import { useSignal, Signal } from '@preact/signals-react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface AppProviderProps {
  children: ReactNode;
}
export interface State {
  loadingIfc: Signal<boolean>;
}
const AppContext = createContext<State | undefined>(undefined);

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const appState: State = {
    loadingIfc: useSignal<boolean>(false),
  };

  return (
    <AppContext.Provider value={appState}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): State => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};


function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <Viewer/>
      </ThemeProvider>
    </AppProvider>
  )
}

export default App




