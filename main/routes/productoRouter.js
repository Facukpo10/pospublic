import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/producto", (req, res) => {
    db.all(/*
        "SELECT p.id_producto, p.codigo, p.nombre, p.descripcion, p.id_categoria, c.nombre AS categoria, p.precio_compra, p.precio_venta, s.cantidad FROM producto p JOIN categoria c on p.id_categoria =c.id_categoria JOIN stock s ON s.id_producto = p.id_producto WHERE estado = 1;", (err, rows) => {
        */`SELECT 
  p.id_producto, 
  p.codigo, 
  p.nombre, 
  p.descripcion, 
  p.id_categoria, 
  c.nombre AS categoria, 
  p.precio_compra, 
  p.precio_venta, 
  s.cantidad,
  p.estado 
FROM producto p 
LEFT JOIN categoria c ON p.id_categoria = c.id_categoria 
LEFT JOIN stock s ON s.id_producto = p.id_producto ;`, (err, rows) => {

            if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    }
    );
});

/*router.post("/producto", (req, res) => {
    const { codigo, nombre, descripcion, id_categoria, precio_compra, precio_venta, estado } = req.body;
    db.run("INSERT INTO producto (codigo, nombre, descripcion, id_categoria, precio_compra, precio_venta, estado) VALUES (?, ?, ?, ?, ?, ?, 1)", [codigo, nombre, descripcion, id_categoria, precio_compra, precio_venta], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, codigo, nombre, descripcion, id_categoria, precio_compra, precio_venta, estado });
    });
});*/

router.post('/producto', (req, res) => {
    const { codigo, nombre, descripcion, id_categoria, precio_compra, precio_venta, cantidad } = req.body;

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        db.run(
            `INSERT INTO producto (codigo, nombre, descripcion, id_categoria, precio_compra, precio_venta)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [codigo, nombre, descripcion, id_categoria, precio_compra, precio_venta],
            function (err) {
                if (err) {
                    console.error("Error al insertar producto:", err.message);
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: 'Error al insertar producto', detalle: err.message });

                }
                const id_producto = this.lastID;


                db.run(
                    `INSERT INTO stock (id_producto, cantidad) VALUES (?, ?)`,
                    [id_producto, cantidad],
                    function (err2) {
                        if (err2) {
                            console.error("Error al insertar stock:", err2.message);
                            db.run("ROLLBACK");
                            return res.status(500).json({ error: 'Error al insertar stock' });
                        }

                        db.run("COMMIT");
                        res.status(200).json({ message: 'Producto y stock insertados correctamente' });
                    }
                );
            }
        );
    });
});

/*router.put("/producto/:id", (req, res) => {
    const { id } = req.params;
    const { codigo, nombre, descripcion, id_categoria, precio_compra, precio_venta, estado } = req.body;
    db.run("UPDATE producto SET codigo = ?, nombre = ?, descripcion = ?, id_categoria = ?, precio_compra = ?, precio_venta = ?, estado = ? WHERE id = ?", [codigo, nombre, descripcion, id_categoria, precio_compra, precio_venta, estado, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, codigo, nombre, descripcion, id_categoria, precio_compra, precio_venta, estado });
    });
});*/

router.put("/producto/:id", (req, res) => {
    const { id } = req.params;
    const { codigo, nombre, descripcion, id_categoria, precio_compra, precio_venta, cantidad, estado } = req.body;
    db.run("BEGIN TRANSACTION");

    db.run("UPDATE producto SET codigo = ?, nombre = ?, descripcion = ?, id_categoria = ?, precio_compra = ?, precio_venta = ?, estado = ? WHERE id_producto = ?", [codigo, nombre, descripcion, id_categoria, precio_compra, precio_venta, estado, id], function (err) {
        if (err) {
            console.error("Error al actualizar producto:", err.message);
            db.run("rollback");
            return res.status(500).json({ error: "Error al actualizar producto",detalle: err.message });
        }
        db.run("UPDATE stock SET cantidad = ? WHERE id_producto = ?", [cantidad, id], function (err2) {
            if (err2) {
                db.run("rollback");
                return res.status(500).json({ error: "Error al actualizar stock" });
            }
            db.run("COMMIT");
            res.json({ id, codigo, nombre, descripcion, id_categoria, precio_compra, precio_venta, cantidad });
        });
    
    });
})

router.delete("/producto/:id", (req, res) => {
    const { id } = req.params;
    db.run("UPDATE producto SET estado = 0 WHERE id_producto = ? ", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id });
    });
});

router.put("/producto/:id/estado", (req, res) => {
    const { id } = req.params;

    db.run("UPDATE producto SET estado = 1 WHERE id_producto = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ id, mensaje: "Producto activado correctamente" });
    });
});

router.put("/producto/:id/desactivar", (req, res) => {
    const { id } = req.params;

    db.run("UPDATE producto SET estado = 0 WHERE id_producto = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ id, mensaje: "Producto desactivado correctamente" });
    });
});


export default router;