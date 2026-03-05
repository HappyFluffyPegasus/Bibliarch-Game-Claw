import { useState, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes';
import './index.css';
import { SplashScreen } from './components/LoadingScreen';
import { AnimatePresence } from 'framer-motion';

// Auto-save on route change
function RouteChangeHandler() {
  const location = useLocation();
  
  useEffect(() => {
    // Flush any pending debounced saves
    window.dispatchEvent(new Event('beforeunload'));
  }, [location]);
  
  return null;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      
      {!showSplash && (
        <BrowserRouter>
          <RouteChangeHandler />
          <AnimatePresence mode="wait">
            <AppRoutes />
          </AnimatePresence>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;