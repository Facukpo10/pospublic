const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.resolve(__dirname, "DB_PuntoDeVenta.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Activar claves foráneas
  db.run("PRAGMA foreign_keys = ON");
  
});

module.exports = db;