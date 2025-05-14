import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/venta/:id", (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM venta WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Venta no encontrada" });
        res.json(row);
    });
});


router.get("/venta", (req, res) => {
    db.all("SELECT v.id_venta, v.numero_factura, v.fecha_venta, v.subtotal, v.descuento, v.total, v.id_forma_pago, fp.nombre AS forma_pago FROM venta v LEFT JOIN forma_pago fp ON v.id_forma_pago = fp.id_forma_pago ORDER BY v.id_venta DESC;", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post("/venta", (req, res) => {
    console.log(req.body);
    const {
        numero_factura,
        fecha_venta,
        subtotal,
        descuento,
        total,
        id_forma_pago,
        detalle_venta
    } = req.body;

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        db.run(
            "INSERT INTO venta (numero_factura, fecha_venta, subtotal, descuento, total, id_forma_pago) VALUES (?, ?, ?, ?, ?, ?)",
            [numero_factura, fecha_venta, subtotal, descuento, total, id_forma_pago],
            function (err) {
                if (err) {
                    console.error("Error al insertar en tabla venta:", err.message);
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: err.message });
                }

                const idVenta = this.lastID;

                const stmt = db.prepare(
                    "INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, descuento, subtotal) VALUES (?, ?, ?, ?, ?, ?)"
                );

                const stmtCantidad = db.prepare(
                    "UPDATE stock SET cantidad = cantidad - ? WHERE id_producto = ?"
                )

                for (const detalle of detalle_venta) {
                    const { id_producto, cantidad, precio_unitario, descuento, subtotal } = detalle;
                    stmt.run(idVenta, id_producto, cantidad, precio_unitario, descuento, subtotal);
                
                    stmtCantidad.run(cantidad,id_producto)
                }

                stmt.finalize((err2) => {
                    if (err2) {
                        db.run("ROLLBACK");
                        return res.status(500).json({ error: "Error al insertar el detalle de la venta" });
                    }

                    db.run("COMMIT");
                    res.status(200).json({ message: "Venta y detalle insertados correctamente" });
                });
            }
        );
    });
});



    router.put("/venta/:id", (req, res) => {
        const { id } = req.params;
        const { numero_factura, fecha_venta, subtotal, descuento, total, id_forma_pago } = req.body;
        db.run("UPDATE venta SET numero_factura = ?, fecha_venta = ?, subtotal = ?, descuento = ?, total = ?, id_forma_pago = ? WHERE id = ?", [numero_factura, fecha_venta, subtotal, descuento, total, id_forma_pago, id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id, numero_factura, fecha_venta, subtotal, descuento, total, id_forma_pago });
        });
    });

    router.delete("/venta/:id", (req, res) => {
        const { id } = req.params;
        db.run("DELETE FROM venta WHERE id_venta = ?", [id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id });
        });
    });

    export default router;