import express from 'express'
import db from '../db.js'

const router = express.Router()

router.post('/login', (req, res) => {
    const { DNI, password } = req.body;

    db.get("SELECT * FROM usuario WHERE DNI = ? AND password = ?", [DNI, password], (err, user) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

        res.json({
            id: user.id,
            nombre: user.nombre,
            DNI: user.DNI,
            id_rol: user.id_rol
        });
    });
});
export default router