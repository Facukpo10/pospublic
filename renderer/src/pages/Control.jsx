import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Tabla from '../components/tabla'
import { Modal, Toast, Form, Button } from 'react-bootstrap'
import CustomToast from '../components/CustomToast'
function Control() {
    const [userRol, setUserRol] = useState();
    const [productos, setProductos] = useState();
    const [categorias, setCategorias] = useState();
    const [ventas, setVentas] = useState();
    const [detalle, setDetalle] = useState();
    const [usuario, setUsuario] = useState();
    const [filteredUsuarios, setFilteredUsuarios] = useState([]); // Nueva variable para usuarios filtrados
    //declaracion variables toast
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastBg, setToastBg] = useState('success');

    //Variables MODAL USUARIO EMPLEADO
    const [modalEmpleado, setModalEmpleado] = useState(false)
    const cerrarModalEmpleado = () => setModalEmpleado(false);
    const abritModalEmpleado = () => setModalEmpleado(true);

    //Varibales MODAL EDITAR USUARIO EMPLEADO
    const [modalEditarEmpleado, setEditarEmpleado] = useState(false)
    const cerrarModalEditarEmpleado = () => setEditarEmpleado(false);
    const abritModalEditarEmpleado = () => setEditarEmpleado(true);

    //variables form USuarios
    const [id, setId] = useState("")
    const [nombre, setNombre] = useState("")
    const [dni, setDNI] = useState("")
    const [password, setPassword] = useState("")
    const [rol, setRol] = useState("")

    useEffect(() => {
        getProductos()
        getVentas()
        getUsuario()
        getCategorias()
        setUserRol(localStorage.getItem("rol"))

    }, [])
    useEffect(() => {
        // Filtrar usuarios según el rol del usuario logueado
        if (usuario && userRol) {
            const filtered = usuario.filter((u) => parseInt(u.id_rol) >= parseInt(userRol));
            setFilteredUsuarios(filtered);
        }
    }, [usuario, userRol]); // Ejecutar cada vez que cambien los usuarios o el rol del usuario logueado


    function mostrarToast(mensaje, tipo = 'success') {
        setToastMessage(mensaje);
        setToastBg(tipo);
        setShowToast(true);
    }

    function getProductos() {
        axios.get("http://localhost:3001/producto").then((res) => setProductos(res.data))
            .catch(err => { console.log(err) })
    }

    function getVentas() {
        axios.get("http://localhost:3001/venta").then((res) => setVentas(res.data))
            .catch(err => { console.log(err) })
    }

    function getCategorias() {
        axios.get("http://localhost:3001/categorias").then((res) => setCategorias(res.data))
            .catch(err => { console.log(err) })
    }

    function getDetalle() {
        axios.get("http://localhost:3001/detalleVenta").then((res) => setDetalle(res.data))
            .catch(err => { console.log(err) })
    }

    function getUsuario() {
        axios.get("http://localhost:3001/usuario").then((res) => setUsuario(res.data))
    }

    function crearUsuarioEmpleado() {
        if (nombre === '' || dni === '' || password === '') {
            mostrarToast('ALERTA CAMPO VACIO, por favor complete todos los campos', "danger")
            return
        }
        axios.post("http://localhost:3001/usuario",
            {
                nombre: nombre,
                DNI: dni,
                password: password,
                id_rol: rol
            }
        ).then((res) => {
            mostrarToast("Usuario creado con exito")
            getUsuario()
            cerrarModalEmpleado()
        }).catch((err) => {
            console.log(err)
            mostrarToast("error, Usuario no registrado. Verifique que todos los campos esten cubiertos", "danger")
        })
    }

    function deleteUsuario(row) {
        axios.delete(`http://localhost:3001/usuario/${row.id}`).then((res) => {
            console.log(res)
            getUsuario()
            mostrarToast("Usuario Borrado con exito")

        }).catch((err) => {
            console.log(err)
            mostrarToast("error: Usuario no eliminado", "danger")
        })
        console.log(row)

    }

    function editarEmpleado() {
        axios.put(`http://localhost:3001/usuario/${id}`,
            {
                nombre: nombre,
                DNI: dni,
                password: password,
                id_rol: rol
            }
        ).then((res)=>{
            console.log(res)
            getUsuario()
            mostrarToast("Usuario editado correctamente")
            cerrarModalEditarEmpleado()
        }).catch((err) => {
            console.log(err)
            mostrarToast("ERROR:usuario no editado","danger")
        })
    }

    function setearEmpleado(id) {
        setId(id.id)
        setNombre(id.nombre)
        setDNI(id.DNI)
        setPassword(id.password)
        setRol(id.id_rol)
        abritModalEditarEmpleado()
    }

    return (
        <div>
            <h1>Control Usuario</h1>
            <Button className='m-2' onClick={abritModalEmpleado}>Crear Usuario</Button>

            <div id='Tabla-usuario' className="m-2">
                <Tabla data={filteredUsuarios} onDelete={deleteUsuario} onEdit={setearEmpleado} />
            </div>


            <Modal show={modalEditarEmpleado} onHide={cerrarModalEditarEmpleado} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Empleado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre:</Form.Label>
                            <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>DNI:</Form.Label>
                            <Form.Control type="number" value={dni} onChange={(e) => setDNI(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>password</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        {(userRol === "1" || userRol === "2") &&
                            <Form.Group className="mb-3">
                                <Form.Label>Privilegios</Form.Label>
                                <Form.Select value={rol} onChange={(e) => setRol(e.target.value)}>
                                    <option value="">Seleccione una categoría</option>
                                    {userRol === "1" &&
                                        <>
                                            <option key='1' value='1'>admin</option>
                                            <option key='2' value='2'>Encargado</option>
                                        </>
                                    }
                                    <option key='3' value='3'>Empleado</option>

                                </Form.Select>
                            </Form.Group>
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={cerrarModalEditarEmpleado}>Cancelar</Button>
                    <Button variant='success' onClick={editarEmpleado}>Editar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={modalEmpleado} onHide={cerrarModalEmpleado} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Empleado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre:</Form.Label>
                            <Form.Control type="text" onChange={(e) => setNombre(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>DNI:</Form.Label>
                            <Form.Control type="number" onChange={(e) => setDNI(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>password</Form.Label>
                            <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        {(userRol === "1" || userRol === "2") &&
                            <Form.Group className="mb-3">
                                <Form.Label>Privilegios</Form.Label>
                                <Form.Select onChange={(e) => setRol(e.target.value)}>
                                    <option value="">Seleccione una categoría</option>
                                    {userRol === "1" &&
                                        <>
                                            <option key='1' value='1'>admin</option>
                                            <option key='2' value='2'>Encargado</option>
                                        </>
                                    }
                                    <option key='3' value='3'>Empleado</option>

                                </Form.Select>
                            </Form.Group>
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={cerrarModalEmpleado}>Cancelar</Button>
                    <Button variant='success' onClick={crearUsuarioEmpleado}>Crear</Button>
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

export default Control