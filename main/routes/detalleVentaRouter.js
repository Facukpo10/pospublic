import { Router } from "express";
import db from "../db.js";

const router = Router();    

router.get("/detalleVenta", (req, res) => {
    db.all("SELECT * FROM detalle_Venta", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.get("/detalleVenta/:id", (req, res) => {
    const { id } = req.params;
    db.all("select dv.id_detalle_venta, dv.id_venta, dv.id_producto, dv.cantidad, dv.precio_unitario,dv.descuento, dv.subtotal, p.codigo, p.nombre from detalle_venta dv left join producto p on dv.id_producto = p.id_producto WHERE id_venta = ?;", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
}
);

router.post("/detalleVenta", (req, res) => {
    const {id_venta, id_producto, cantidad, precio_unitario, descuento,subtotal } = req.body;
    db.run("INSERT INTO detalle_Venta (id_venta, id_producto, cantidad, precio_unitario, descuento, subtotal) VALUES (?, ?, ?, ?, ?, ?)", [id_venta, id_producto, cantidad, precio_unitario, descuento, subtotal], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, id_venta, id_producto, cantidad, precio_unitario, descuento, subtotal });
    });
});

router.put("/detalleVenta/:id", (req, res) => {
    const { id } = req.params;
    const { id_venta, id_producto, cantidad, precio_unitario, descuento, subtotal } = req.body;
    db.run("UPDATE detalle_Venta SET id_venta = ?, id_producto = ?, cantidad = ?, precio_unitario = ?, descuento = ?, subtotal = ? WHERE id = ?", [id_venta, id_producto, cantidad, precio_unitario, descuento, subtotal, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, id_venta, id_producto, cantidad, precio_unitario, descuento, subtotal });
    });
});

router.delete("/detalleVenta/:id", (req, res) => { 
    const { id } = req.params;
    db.run("DELETE FROM detalle_Venta WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id });
    });
}
);


export default router;