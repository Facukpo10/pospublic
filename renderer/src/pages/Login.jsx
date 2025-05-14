import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import fondo from '../assets/Productos de goma en orden.png'

const Login = () => {
    const [DNI, setDNI] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/login', { DNI, password });
            localStorage.setItem('usuario', JSON.stringify(res.data.nombre));
            localStorage.setItem('rol', JSON.stringify(res.data.id_rol));
            setMensaje('¡Login exitoso!');
            navigate('/Carrito');
        } catch (err) {
            setMensaje('Credenciales inválidas');
        }
    };

    const estiloFondo = {
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        height: '100vh',
        width: '100vw',
    };
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light opacity=1 " style={estiloFondo}>
            <div
                className="card shadow p-4"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)', // blanco translúcido
                    backdropFilter: 'blur(5px)', // desenfoque del fondo (opcional)
                    border: '1px solid rgba(255, 255, 255, 0.2)' // borde suave
                }}
            >
                <h3 className="text-center mb-4">Iniciar Sesión</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label ">DNI</label>
                        <input
                            type="text"
                            className="form-control"
                            value={DNI}
                            onChange={(e) => setDNI(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Entrar</button>
                </form>
                {mensaje && <div className="alert alert-info mt-3 text-center">{mensaje}</div>}
            </div>
        </div>
    );
};

export default Login;