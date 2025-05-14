
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

export default function CustomToast({ show, message, bg, onClose }) {
    return (
        <ToastContainer position="top-end" className="p-3" containerPosition="fixed" style={{ zIndex: 9999 }}>
            <Toast bg={bg} onClose={onClose} show={show} delay={3000} autohide>
                <Toast.Body className="text-white">{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}
