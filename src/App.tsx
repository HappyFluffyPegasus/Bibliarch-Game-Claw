import { useState, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes';
import './index.css';
import { SplashScreen, LoadingScreen } from './components/LoadingScreen';

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
  const [isLoading, setIsLoading] = useState(false);

  return (
    <BrowserRouter>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <LoadingScreen isLoading={isLoading}>
          <RouteChangeHandler />
          <AppRoutes />
        </LoadingScreen>
      )}
    </BrowserRouter>
  );
}

export default App;