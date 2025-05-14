import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/stock", (req, res) => {
    db.run("SELECT * FROM stock", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post("/stock", (req, res) => {
    const { id_producto, cantidad } = req.body;
    db.run("INSERT INTO stock (id_producto, cantidad) VALUES (?, ?)", [id_producto, cantidad], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, id_producto, cantidad });
    });
}   );  

router.put("/stock/:id", (req, res) => {
    const { id } = req.params;
    const { id_producto, cantidad } = req.body;
    db.run("UPDATE stock SET id_producto = ?, cantidad = ? WHERE id = ?", [id_producto, cantidad, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, id_producto, cantidad });
    });
});

router.delete("/stock/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM stock WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id });
    });
});
export default router;