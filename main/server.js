import express from "express";
import cors from "cors";
import categoriaRouter from "./routes/categoriaRouter.js";
import productoRouter from "./routes/productoRouter.js";
import ventaRouter from "./routes/ventaRouter.js";
import detalleVentaRouter from "./routes/detalleVentaRouter.js";
import formaPagoRouter from "./routes/formadePagoRouter.js";
import stockRouter from "./routes/stockRouter.js";
import usuarioRouter from "./routes/usuarioRouter.js";
import loginRouter from "./routes/loginRoute.js";
const app = express();
const PORT = 3001;

app.use(cors()); // necesario para conectar desde React
app.use(express.json());

app.use(categoriaRouter)
app.use(productoRouter)
app.use(ventaRouter)
app.use(detalleVentaRouter)
app.use(formaPagoRouter)
app.use(stockRouter)
app.use(usuarioRouter)
app.use(loginRouter)
// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ API escuchando en http://localhost:${PORT}`);
});