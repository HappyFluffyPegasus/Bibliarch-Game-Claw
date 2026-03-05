import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes';
import './index.css';

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
  return (
    <BrowserRouter>
      <RouteChangeHandler />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;