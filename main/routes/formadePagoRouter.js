import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/formadePago", (req, res) => {
    db.run("SELECT * FROM formadePago", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post("/formadePago", (req, res) => {
    const { nombre, descripcion } = req.body;
    db.run("INSERT INTO formadePago (nombre, descripcion) VALUES (?,?)", [nombre, descripcion], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nombre });
    });
});

router.put("/formadePago/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    db.run("UPDATE formadePago SET nombre = ?, descripcion = ? WHERE id = ?", [nombre, descripcion, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, nombre });
    });
});

router.delete("/formadePago/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM formadePago WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id });
    });
});

export default router;