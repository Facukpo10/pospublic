import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Stock from './pages/Stock';
import Sidebar from './components/Sidebar';
import Carrito from './pages/Carrito';
import Ventas from './pages/Ventas';
import Control from './pages/Control';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}


function AppContent() {
  const [aut, setAut] = useState();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  useEffect(() => {
    setAut(localStorage.getItem("rol"));
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      {!isLoginPage && <Sidebar />}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: !isLoginPage && isLargeScreen ? '250px' : '0',
          padding: '1rem',
          overflowY: 'auto',
          width: '100%',
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/Carrito" element={<Carrito />} />
          <Route path="/Control" element={<Control />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
