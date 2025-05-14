import React, { use } from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Table, Button, Card, Modal, ListGroupItem, ListGroup } from 'react-bootstrap'
import CustomToast from '../components/CustomToast'
function Ventas() {

    const [ventas, setVentas] = useState([])
    const [ventaID, setVentaID] = useState([])
    const [detalle, setDetalle] = useState([])
    //modal borrado
    const [show, setShow] = useState(false);
    const modalBorrarClose = () => setShow(false);
    const modalBorrarShow = () => setShow(true);
    //modal Detalle
    const [detalleShow, setDetalleShow] = useState(false)
    const modalDetalleClose = () => setDetalleShow(false)
    const modalDetalleOpen = () => setDetalleShow(true)

    //declaracion variables toast
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastBg, setToastBg] = useState('success');

    useEffect(() => {
        getVentas()
    }
        , [])

    function getVentas() {
        axios.get('http://localhost:3001/venta')
            .then(res => {
                console.log(res.data)
                setVentas(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }


    function verDetalle(venta) {
        modalDetalleOpen()
        setVentaID(venta.id_venta)
        console.log(venta)
        axios.get(`http://localhost:3001/detalleVenta/${venta.id_venta}`)
            .then(res => {
                console.log(res.data)
                setDetalle(res.data)
            })
            .catch(err => {
                console.log(err)
            })

    }
    function borrarTicket(venta) {
        console.log(ventaID)

        axios.delete(`http://localhost:3001/venta/${ventaID}`)
            .then(res => {
                mostrarToast('Ticket Borrado')
                modalDetalleClose()
                getVentas()
            }).catch((error) => { console.log(error) })
    }


    function mostrarToast(mensaje, tipo = 'success') {
        setToastMessage(mensaje);
        setToastBg(tipo);
        setShowToast(true);
    }


    return (
        <div className='container'>
            <Card className="text-center">
                <Card.Header>Ventas</Card.Header>
                <Card.Body>
                    <Table striped bordered hover >
                        <thead className='table-dark'>
                            <tr>
                                <th>ID</th>
                                <th>FECHA Y HORA</th>
                                <th>DETALLE</th>
                                <th>TOTAL</th>
                                <th>FORMA DE PAGO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map((venta) => (
                                <tr key={venta.id_venta}>
                                    <td>{venta.id_venta}</td>
                                    <td>{venta.fecha_venta}</td>
                                    <td>
                                        <Button variant="primary" onClick={() => verDetalle(venta)}>Ver Detalle</Button>
                                    </td>
                                    <td>$ {venta.total}</td>
                                    <td>{venta.forma_pago}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal id='Detalle' show={detalleShow} onHide={modalDetalleClose}>
                <Card className="">
                    <Modal.Header closeButton>
                        <Modal.Title>Detalle Venta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card.Body>
                            <ListGroup>
                            <ListGroupItem className="d-flex justify-content-between align-items-center px-3 py-2">
                                            <div style={{ width: '20%' }}>Codigo</div>
                                            <div style={{ width: '20%' }}>Producto</div>
                                            <div style={{ width: '20%' }}>Cantidad</div>
                                            <div style={{ width: '20%' }}>Precio</div>
                                            <div style={{ width: '20%' }}>Subtotal</div>

                                        </ListGroupItem>
                                    {detalle.map((det) => (
                                        <ListGroupItem className="d-flex justify-content-between align-items-center px-3 py-2">
                                            <div style={{ width: '20%' }}>{det.codigo}</div>
                                            <div style={{ width: '20%' }}>{det.nombre}</div>
                                            <div style={{ width: '20%' }}>{det.cantidad}</div>
                                            <div style={{ width: '20%' }}>${det.precio_unitario}</div>
                                            <div style={{ width: '20%' }}>${det.precio_unitario*det.cantidad}</div>

                                        </ListGroupItem>
                                        /*<tr key={det.id_detalle_venta}>

                                       <td>{det.codigo}</td>
                                       <td>{det.nombre}</td>
                                       <td>{det.cantidad}</td>
                                       <td>${det.precio_unitario}</td>
                                       <td>{det.descuento}</td>
                                       <td>{det.subtotal}</td>
                                   </tr>*/
                                    ))}
                        
                            </ListGroup>
                        </Card.Body>
                    </Modal.Body>
                    <Card.Footer className="font-weight-bold"><h1>Total: ${detalle.reduce((acc, det) => acc + det.subtotal, 0)}</h1>
                        <Button variant="danger" onClick={() => borrarTicket(detalle)}>Borrar Ticket</Button>
                    </Card.Footer>

                </Card>
            </Modal>

            <div>
                <Modal show={show} onHide={modalBorrarClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Borrar Ticket</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h3>¿Está seguro que desea borrar el ticket?</h3>
                        <p>Esta acción no se puede deshacer.</p>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={modalBorrarClose}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={() => { borrarTicket() }}>
                            Borrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <CustomToast
                show={showToast}
                message={toastMessage}
                bg={toastBg}
                onClose={() => setShowToast(false)}
            />
        </div>
    )
}

export default Ventas