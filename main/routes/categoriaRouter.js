import { Router } from 'express';
import db from "../db.js";

const router = Router();

router.get("/categorias", (req, res) => {
  db.all("SELECT * FROM categoria", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
})

router.post("/categorias", (req, res) => {
  const { nombre } = req.body;
  db.run("INSERT INTO categoria (nombre) VALUES (?)", [nombre], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, nombre });
  });
})

router.put("/categorias/:id", (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  db.run("UPDATE categoria SET nombre = ? WHERE id = ?", [nombre, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, nombre });
  });
});

router.delete("/categorias/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM categoria WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id });
  });
});



export default router;