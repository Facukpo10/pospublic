import axios from "axios"
import { useState, useEffect } from "react"
import React from "react"
import { Card, Table, Button, Modal, ListGroup, ListGroupItem, Form, Toast, ToastContainer } from "react-bootstrap"

function Carrito() {
    const [productos, setProductos] = useState([])
    const [carrito, setCarrito] = useState([])
    const [cantidad, setCantidad] = useState(1)
    const [categorias, setCategorias] = useState([])
    const [total, setTotal] = useState(0)
    const [busqueda, setBusqueda] = useState("")
    const [formaPago, setFormaPago] = useState(1)
    const [loading, setLoading] = useState(true)
    //variables venta
    const [fecha_venta, setFecha_venta] = useState(new Date().toLocaleString())
    const [descuento, setDescuento] = useState(0)
    const [subtotal, setSubtotal] = useState(0)

    //variables modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [id_producto, setId_producto] = useState("")
    const [nuevaCantidad, setNuevaCantidad] = useState(0)

    //variables modal forma de pago
    const [showFormaPago, setShowFormaPago] = useState(false);
    const handleCloseFormaPago = () => setShowFormaPago(false);
    const handleShowFormaPago = () => setShowFormaPago(true);

    //variables toasts
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastBg, setToastBg] = useState("success");


    useEffect(() => {
        getProductos()
    }
        , [])



        function agregarCarrito(id_producto) {
            setCantidad(1)
            const producto = productos.find((producto) => producto.id_producto === id_producto);
            if (producto) {
                const productoEnCarrito = carrito.find((item) => item.id_producto === id_producto);
                const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;
        
                // Verificar si hay suficiente stock
                if (cantidadEnCarrito + cantidad > producto.cantidad) {
                    mostrarToast("No hay suficiente stock disponible", "danger");
                    return;
                }
        
                if (productoEnCarrito) {
                    const nuevoCarrito = carrito.map((item) => {
                        if (item.id_producto === id_producto) {
                            return { ...item, cantidad: +item.cantidad + +cantidad };
                        }
                        return item;
                    });
                    setCarrito(nuevoCarrito);
                } else {
                    const nuevoProducto = { ...producto, cantidad: cantidad };
                    setCarrito([...carrito, nuevoProducto]);
                }
                setTotal(total + producto.precio_venta * cantidad);
            } else {
                console.log("Producto no encontrado");
            }
        }
        
    function limpiarCarrito() {
        setCarrito([])
        setTotal(0)
    }
    function getProductos() {
        axios.get("http://localhost:3001/producto")
            .then((response) => {
                setProductos(response.data)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
                setLoading(false)
            })
    }
    function restarProducto(id_producto) {
        const producto = carrito.find((producto) => producto.id_producto === id_producto)
        if (producto) {
            if (producto.cantidad > 1) {
                const nuevoCarrito = carrito.map((item) => {
                    if (item.id_producto === id_producto) {
                        return { ...item, cantidad: item.cantidad - 1 }
                    }
                    return item
                })
                setCarrito(nuevoCarrito)
                setTotal(total - producto.precio_venta)
            } else {
                const nuevoCarrito = carrito.filter((item) => item.id_producto !== id_producto)
                setCarrito(nuevoCarrito)
                setTotal(total - producto.precio_venta)
            }
        } else {
            console.log("Producto no encontrado")
        }
        console.log(carrito)
    }
    function agregarCantidad(id_producto) {
        const productoEnCarrito = carrito.find((item) => item.id_producto === id_producto);
        const producto = productos.find((producto) => producto.id_producto === id_producto);
    
        if (productoEnCarrito && producto) {
            // Verificar si hay suficiente stock
            if (productoEnCarrito.cantidad + cantidad > producto.cantidad) {
                mostrarToast("No hay suficiente stock disponible", "danger");
                return;
            }
    
            const nuevoCarrito = carrito.map((item) => {
                if (item.id_producto === id_producto) {
                    return {
                        ...item,
                        cantidad: +item.cantidad + +cantidad,
                    };
                }
                return item;
            });
    
            setCarrito(nuevoCarrito);
            setTotal(total + producto.precio_venta * cantidad);
        } else {
            agregarCarrito(id_producto);
        }
        handleClose();
        setCantidad(1)
    }
    function setCantidadProducto(id_producto) {
        console.log(id_producto)
        setId_producto(id_producto)
        handleShow()


    }
    async function agregarVenta() {
        console.log(carrito, "pago" + formaPago, "subtotal" + subtotal, descuento, total)
        console.log("fecha" + fecha_venta)
        axios.post("http://localhost:3001/venta", {
            fecha_venta: fecha_venta,
            subtotal: total,
            descuento: descuento,
            total: total,
            id_forma_pago: formaPago,
            detalle_venta: carrito.map((item) => ({
                id_producto: item.id_producto,
                cantidad: item.cantidad,
                precio_unitario: item.precio_venta,
                descuento: 0,
                subtotal: item.precio_venta * item.cantidad
            }))
        }).then((response) => {
            console.log(response.data)
            handleCloseFormaPago();
            mostrarToast("Compra realizada")
            limpiarCarrito()
        }).catch((error) => {
            console.log(error)
            mostrarToast("error realizar la compra", "danger")

        }
        )
    }

    function realizarCompra(id_producto) {
        setFecha_venta(new Date().toLocaleString())
        console.log(carrito)
        if (carrito.length == 0) {
            mostrarToast("No existen productos en el carrito", "danger")
        } else {
            handleShowFormaPago()
            console.log("realizar compra")
            console.log(carrito)
        }
    }

    function eliminarProductoCarrito(id_producto) {
        const producto = carrito.find((producto) => producto.id_producto === id_producto)
        if (producto) {
            const nuevoCarrito = carrito.filter((item) => item.id_producto !== id_producto)
            setCarrito(nuevoCarrito)
            setTotal(total - (producto.precio_venta * producto.cantidad))
        } else {
            console.log("Producto no encontrado")
        }
    }

    function mostrarToast(mensaje, tipo = "success") {
        setToastMessage(mensaje);
        setToastBg(tipo);
        setShowToast(true);
    }

    return (
        
        <div className="flex-grow-1 p-4" id="inicio" >
            <h1 className="content center">GOMANORT</h1>
            <Form.Control
                type="text"
                placeholder="Buscar por nombre o código"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="mt-3 mb-3"
            />
            {loading ? <p>Cargando productos...</p> :
                <table className="table table-hover table-striped shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>Codigo</th>
                            <th>Nombre</th>
                            <th>Descripcion</th>
                            <th>Categoria</th>
                            <th>Precio Venta</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos
                            .filter((producto) => producto.estado === 1 &&
                                (
                                    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                                    producto.codigo.toLowerCase().includes(busqueda.toLowerCase())
                                )
                            )
                            .map((producto) => (
                                <tr key={producto.id_producto}>
                                    <td>{producto.codigo}</td>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.descripcion}</td>
                                    <td>{producto.categoria}</td>
                                    <td>{producto.precio_venta}</td>
                                    <td>
                                        <Button onClick={() => agregarCarrito(producto.id_producto)}>agregar</Button>
                                    </td>
                                    <td>
                                        <Button onClick={() => setCantidadProducto(producto.id_producto)}>Agregar Cantidad</Button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            }
            <div><h1>Carrito</h1></div>
            <div className="d-flex justify-content-between" id="carrito">
                <Table striped bordered hover className="shadow-sm">
                    <thead>
                        <tr>
                            <th>Codigo</th>
                            <th>Nombre</th>
                            <th>Precio Venta</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrito.map((producto) => (
                            <tr key={producto.id_producto}>
                                <td>{producto.codigo}</td>
                                <td>{producto.nombre}</td>
                                <td>$ {producto.precio_venta}</td>
                                <td className="d-flex justify-content-around">
                                    <Button className="btn btn-primary " onClick={() => agregarCarrito(producto.id_producto)}>+</Button>
                                    <p className="mb-0">{producto.cantidad}</p>
                                    <Button className="btn btn-danger" onClick={() => restarProducto(producto.id_producto)}>-</Button>
                                    <Button className="btn btn-warning" onClick={() => eliminarProductoCarrito(producto.id_producto)}>X</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="d-flex flex-column align-items-end">
                    <h2>Total: ${total}</h2>
                    <div className="d-flex flex-column gap-2 mt-2">
                        <Button onClick={() => realizarCompra(handleShow)}>Finalizar Compra</Button>
                        <Button variant='secondary' onClick={() => limpiarCarrito()}>Limpiar Carrito</Button>
                    </div>
                </div>
            </div>

            {/* Modal para agregar ticket */}
            {showFormaPago && (
                <Modal show={showFormaPago} onHide={handleCloseFormaPago}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ticket</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="d-flex justify-content-around">
                        <Card>
                            <Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroupItem>
                                        <h1>GOMANORT</h1>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <p>{fecha_venta}</p>
                                        <p>Datos Local</p>
                                        <p>El manantial - Tucuman</p>

                                    </ListGroupItem>
                                    {carrito.map((producto) => (
                                        <ListGroupItem className="d-flex justify-content-between align-items-center px-3 py-2">
                                            <div style={{ width: '20%' }}>{producto.codigo}</div>
                                            <div style={{ width: '40%' }}>{producto.nombre}</div>
                                            <div style={{ width: '20%' }}>${producto.precio_venta}</div>
                                        </ListGroupItem>
                                    ))}

                                    <ListGroupItem className="d-flex justify-content-between align-items-center px-3 py-2">
                                        <div style={{ width: '20%' }}>TOTAL:</div>
                                        <div style={{ width: '20%' }}>---</div>
                                        <div style={{ width: '20%' }}>{total}</div>
                                    </ListGroupItem>

                                    <ListGroupItem className="d-flex flex-column">
                                        <label className="mb-2">Forma de pago</label>
                                        <div className="d-flex justify-content-between align-items-center">

                                            <Form.Select className="mb-3" aria-label="Default select example" value={formaPago} onChange={(e) => setFormaPago(e.target.value)}>
                                                <option value="1">Efectivo</option>
                                                <option value="2">Tarjeta</option>
                                            </Form.Select>
                                        </div>

                                        <Button onClick={() => agregarVenta()}>Realizar Compra</Button>
                                    </ListGroupItem>
                                </ListGroup>
                            </Card.Body>

                        </Card>
                    </Modal.Body>
                </Modal>
            )}
            {/* Modal para agregar cantidad */}
            {show && (
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Cantidad</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => { agregarCantidad(id_producto); }}>
                            Agregar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}


            <ToastContainer position="top-end" className="p-3" containerPosition="fixed">
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    bg={toastBg}
                    delay={3000}
                    autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">Gomanort</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    )
}

export default Carrito