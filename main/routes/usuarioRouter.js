import { Router } from 'express';
import db from "../db.js";

const router = Router();

router.get("/usuario", (req, res) => {
  db.all("SELECT * FROM usuario", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
})

router.post("/usuario", (req, res) => {
  const { nombre,DNI,password,id_rol} = req.body;
  db.run("INSERT INTO usuario (nombre,DNI,password,id_rol) VALUES (?,?,?,?)", [nombre,DNI,password,id_rol], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, nombre });
  });
})

router.put("/usuario/:id", (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  db.run("UPDATE usuario SET nombre = ? WHERE id = ?", [nombre, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, nombre });
  });
});

router.delete("/usuario/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM usuario WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id });
  });
});



export default router;