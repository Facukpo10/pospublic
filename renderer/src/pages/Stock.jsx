import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Button, Modal, Form, Table, Container } from 'react-bootstrap';


import CustomToast from '../components/CustomToast'
function Stock() {

    const url = "http://localhost:3001/producto"
    const url2 = "http://localhost:3001/stock"
    const url3 = "http://localhost:3001/categoria"
    const [productos, setProductos] = useState([])
    const [stock, setStock] = useState([])
    const [categoria, setCategoria] = useState([])
    const [busqueda, setBusqueda] = useState('')
    //declaracion de variables para el modal producto
    const [modalProducto, setModalProducto] = useState(false)
    const cerrarModalProducto = () => setModalProducto(false);
    const abritModalProducto = () => setModalProducto(true);

    //declaracion variables para el modal categoria
    const [modalCategoria, setModalCategoria] = useState(false)
    const cerrarModalCategoria = () => setModalCategoria(false);
    const abritModalCategoria = () => setModalCategoria(true);

    //declaracion de variables para el modal editar producto
    const [modalEditarProducto, setModalEditarProducto] = useState(false)
    const cerrarModalEditarProducto = () => setModalEditarProducto(false);
    const abrirModalEditarProducto = () => setModalEditarProducto(true);

    //declaracion de variables para el formulario de producto y cantidad de stock
    const [id_Producto, setId_Producto] = useState('')
    const [codigo, setCodigo] = useState('')
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [categoriaId, setCategoriaId] = useState('')
    const [precioCompra, setPrecioCompra] = useState('')
    const [precioVenta, setPrecioVenta] = useState('')
    const [cantidad, setCantidad] = useState(0)
    const [estado, setEstado] = useState('')
    //declaracion variables para el formulario de la categoria
    const [NombreCategoria, setNombreCategoria] = useState('')

    //declaracion variables toast
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastBg, setToastBg] = useState('success');


    useEffect(() => {
        getCategorias()
        getProductos()
    }, [])

    function createCategoria(e) {
        e.preventDefault()
        if (NombreCategoria === '') {
            mostrarToast('Campo vacio', "danger")
            return
        }
        console.log(NombreCategoria)
        axios.post('http://localhost:3001/categorias', {
            nombre: NombreCategoria
        })
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        setNombreCategoria('');
        cerrarModalCategoria();
    }

    function getCategorias() {
        axios.get('http://localhost:3001/categorias')
            .then(res => {
                setCategoria(res.data)
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }


    function getProductos() {
        axios.get('http://localhost:3001/producto')
            .then(res => {
                setProductos(res.data)
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function createProducto() {
        setCodigo('');
        setNombre('');
        setDescripcion('');
        setCategoriaId('');
        setPrecioCompra('');
        setPrecioVenta('');
        setCantidad(0);
        if (codigo === '' || nombre === '' || descripcion === '' || categoriaId === '' || precioCompra === '' || precioVenta === '' || cantidad === '') {
            mostrarToast('ALERTA CAMPO VACIO, por favor complete todos los campos', "danger")
            return
        }
        axios.post('http://localhost:3001/producto', {
            codigo: codigo,
            nombre: nombre,
            descripcion: descripcion,
            id_categoria: categoriaId,
            precio_compra: precioCompra,
            precio_venta: precioVenta,
            cantidad: cantidad
        })
            .then(res => {
                console.log(res.data)
                getProductos()
                mostrarToast("Producto creado")
                cerrarModalProducto()
            })
            .catch(err => {
                console.log(err.response.data.error)
                if (err.response.data.detalle == 'SQLITE_CONSTRAINT: UNIQUE constraint failed: Producto.codigo') {
                    mostrarToast("Error producto ya ingresado", "danger")
                }

            })

    }
    function eliminarProducto(id) {
        axios.delete(`http://localhost:3001/producto/${id}`)
            .then(res => {
                console.log(res.data)
                mostrarToast("Producto descativado")
                getProductos()
            })
            .catch(err => {
                console.log(err)
            })
        console.log(id)
    }

    function editarProducto(id) {
        if (codigo === '' || nombre === '' || descripcion === '' || categoriaId === '' || precioCompra === '' || precioVenta === '' || cantidad === '' || estado === '') {
            mostrarToast('ALERTA CAMPO VACIO, por favor complete todos los campos', "danger")
            return
        }
        axios.put(`http://localhost:3001/producto/${id}`, {
            codigo: codigo,
            nombre: nombre,
            descripcion: descripcion,
            id_categoria: categoriaId,
            precio_compra: precioCompra,
            precio_venta: precioVenta,
            cantidad: Number(cantidad),
            estado: estado

        })
            .then(res => {
                console.log(res.data)
                console.log(cantidad)
                mostrarToast("Producto editado")
                cerrarModalEditarProducto()
                getProductos()
            })
            .catch(err => {
                console.log(err.response.data.error)
                if (err.response.data.detalle == 'SQLITE_CONSTRAINT: UNIQUE constraint failed: Producto.codigo') {
                    mostrarToast("Error: CODIGO YA EN USO", "danger")
                }

            })
        setCodigo('');
        setNombre('');
        setDescripcion('');
        setCategoriaId('');
        setPrecioCompra('');
        setPrecioVenta('');
        setCantidad(0);

        console.log(id)
    }

    function setModalEditarP(producto) {
        console.log(producto)
        setId_Producto(producto.id_producto)
        setCodigo(producto.codigo)
        setNombre(producto.nombre)
        setDescripcion(producto.descripcion)
        setCategoriaId(producto.id_categoria)
        setPrecioCompra(producto.precio_compra)
        setPrecioVenta(producto.precio_venta)
        setCantidad(producto.cantidad ?? 0);
        setEstado(producto.estado)
        abrirModalEditarProducto()
    }

    //Funcion que muestra los mensajes que remplazan a las alertas
    function mostrarToast(mensaje, tipo = 'success') {
        setToastMessage(mensaje);
        setToastBg(tipo);
        setShowToast(true);
    }
    function activarProducto(id_producto) {
        axios.put(`http://localhost:3001/producto/${id_producto}/estado`,
            { estado: 1 }
        ).then(res => {
            mostrarToast("Producto Activado")
            getProductos()
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <div className="flex-grow-1 p-5" style={{ backgroundColor: '#f8f9fa' }}>

            <h1>Inventario</h1>

            <div className="d-flex justify-content-end mb-3">
                <Form.Control
                    type="text"
                    placeholder="Buscar por nombre o código"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="mt-3 mb-3 mr-3"
                />
                <Button variant="primary" className='ms-3' onClick={abritModalProducto}>Agregar Producto</Button>
                <Button className="ms-2" variant="success" onClick={abritModalCategoria}>Agregar Categoría</Button>
            </div>
            <h2>Productos con bajo stock</h2>
            <Table striped bordered hover responsive>
                 <thead className="table-dark">
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th>Precio de Compra</th>
                        <th>Precio de Venta</th>
                        <th>Cantidad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.filter((producto)=>
                    producto.cantidad <= 10
                ).map((producto)=>(
                    <tr key={producto.id_producto}>
                            <td>{producto.codigo}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.categoria}</td>
                            <td>${producto.precio_compra}</td>
                            <td>${producto.precio_venta}</td>
                            <td>{producto.cantidad}</td>
                            <td>
                                <span className={`badge ${producto.estado === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                    {producto.estado === 1 ? "Activo" : "Inactivo"}
                                </span>
                            </td>
                            <td className="d-flex gap-2">
                                {producto.estado === 1 ? (
                                    <Button variant="outline-danger" size="sm" onClick={() => eliminarProducto(producto.id_producto)}>
                                        Desactivar
                                    </Button>
                                ) : (
                                    <Button variant="outline-success" size="sm" onClick={() => activarProducto(producto.id_producto)}>
                                        Activar
                                    </Button>
                                )}
                                <Button size="sm" variant="warning" onClick={() => setModalEditarP(producto)}>
                                    Editar
                                </Button>
                            </td>
                        </tr>
                ))
                    
                    }
                </tbody>
            </Table>
            <h2 className="mb-3">Productos</h2>

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th>Precio de Compra</th>
                        <th>Precio de Venta</th>
                        <th>Cantidad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                    
                </thead>
                <tbody>
                    {productos.filter((producto) =>
                        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                        producto.codigo.toLowerCase().includes(busqueda.toLowerCase())
                    ).map((producto) => (
                        <tr key={producto.id_producto}>
                            <td>{producto.codigo}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.categoria}</td>
                            <td>${producto.precio_compra}</td>
                            <td>${producto.precio_venta}</td>
                            <td>{producto.cantidad}</td>
                            <td>
                                <span className={`badge ${producto.estado === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                    {producto.estado === 1 ? "Activo" : "Inactivo"}
                                </span>
                            </td>
                            <td className="d-flex gap-2">
                                {producto.estado === 1 ? (
                                    <Button variant="outline-danger" size="sm" onClick={() => eliminarProducto(producto.id_producto)}>
                                        Desactivar
                                    </Button>
                                ) : (
                                    <Button variant="outline-success" size="sm" onClick={() => activarProducto(producto.id_producto)}>
                                        Activar
                                    </Button>
                                )}
                                <Button size="sm" variant="warning" onClick={() => setModalEditarP(producto)}>
                                    Editar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>



            {/* Modal Crear Producto */}
            <Modal show={modalProducto} onHide={cerrarModalProducto} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Código</Form.Label>
                            <Form.Control type="text" onChange={(e) => setCodigo(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" onChange={(e) => setNombre(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control type="text" onChange={(e) => setDescripcion(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select onChange={(e) => setCategoriaId(e.target.value)}>
                                <option value="">Seleccione una categoría</option>
                                {categoria.map((cat) => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio de Compra</Form.Label>
                            <Form.Control type="number" onChange={(e) => setPrecioCompra(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio de Venta</Form.Label>
                            <Form.Control type="number" onChange={(e) => setPrecioVenta(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control type="number" onChange={(e) => setCantidad(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarModalProducto}>Cancelar</Button>
                    <Button variant="primary" onClick={createProducto}>Guardar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Crear Categoría */}
            <Modal show={modalCategoria} onHide={cerrarModalCategoria} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Categoría</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nombre Categoría</Form.Label>
                            <Form.Control type="text" onChange={(e) => setNombreCategoria(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarModalCategoria}>Cancelar</Button>
                    <Button variant="primary" onClick={createCategoria}>Guardar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Editar Producto */}
            <Modal show={modalEditarProducto} onHide={cerrarModalEditarProducto} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Código</Form.Label>
                            <Form.Control type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
                                {categoria.map((cat) => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio de Compra</Form.Label>
                            <Form.Control type="number" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio de Venta</Form.Label>
                            <Form.Control type="number" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control type="number" value={cantidad ?? 0} onChange={(e) => setCantidad(Number(e.target.value))} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarModalEditarProducto}>Cancelar</Button>
                    <Button variant="primary" onClick={() => editarProducto(id_Producto)}>Editar</Button>
                </Modal.Footer>
            </Modal>

            <CustomToast
                show={showToast}
                message={toastMessage}
                bg={toastBg}
                onClose={() => setShowToast(false)}
            />
        </div>

    )
}

export default Stock