// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Nav, Offcanvas, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function Sidebar() {
  const [show, setShow] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setRol(localStorage.getItem('rol')); // actualizar rol por si cambió
    setShow(true);
  };
  const location = useLocation(); // Hook para obtener la ruta actual
  const [rol, setRol] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {

    setRol(localStorage.getItem("rol"));

    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };


  if (location.pathname === "/") {
    return null;
  }

  return (
    <>
      {isLargeScreen ? (
        <div className="sidebar-fixed p-3">
          <h4 className="text-white">GOMANORT</h4>
          <Nav className="flex-column">


            {(rol === "3" || rol === '2' || rol === '1') && (
              <>     <Nav.Link href="/Carrito" className="text-white">Venta Producto</Nav.Link>
                <Nav.Link href="/stock" className="text-white">Inventario</Nav.Link>
                {(rol === "1" || rol === "2") && (<>
                  <Nav.Link href="/ventas" className="text-white">Ventas</Nav.Link>
                  <Nav.Link href="/control" className="text-white">Control Usuario</Nav.Link>
                </>
                )}

                <Nav.Link className="text-white" onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}>
                  Cerrar sesión
                </Nav.Link>
              </>
            )}
          </Nav>
        </div>
      ) : (
        <div className="d-lg-none">
          <Button
            variant="secondary"
            onClick={handleShow}
            className="m-2"
            style={{ zIndex: 1050 }}
          >
            ☰
          </Button>

          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>GOMANORT</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-column">

                {(rol === "1" || rol === '2' || rol === '3') && (
                  <>

                    <Nav.Link href="/Carrito">Ventas</Nav.Link>
                    <Nav.Link href="/stock">Inventario</Nav.Link>
                    {(rol === "1" || rol === "2") && (<>
                      <Nav.Link href="/ventas">Ventas</Nav.Link>
                      <Nav.Link href="/control">Control Usuario</Nav.Link>
                    </>
                    )}

                    <Nav.Link onClick={() => {
                      localStorage.clear();
                      navigate('/');
                      handleClose()
                    }}>
                      Cerrar sesión
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>

          </Offcanvas>
        </div>
      )}
    </>
  );
}

export default Sidebar;