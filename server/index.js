const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"tienda"
});

/**
 * *Crud fabricantes
 */
app.post("/create",(req,res)=>{
    const nombre = req.body.nombre;

    db.query('INSERT INTO fabricante(nombre) VALUE(?)',[nombre],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send("Fabricante registrado con exito!");
        }
    });
});

app.get("/fabricantes",(req,res)=>{

    db.query('SELECT * FROM fabricante',(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    });
});

app.put("/update", (req, res) => {
    const codigo = req.body.codigo;
    const nombre = req.body.nombre;
  
    db.query('UPDATE fabricante SET nombre=? WHERE codigo=?', [nombre, codigo], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar el fabricante");
      } else {
        res.send("Fabricante actualizado con éxito");
      }
    });
  });
  
  app.delete("/delete/:codigo", (req, res) => {
    const codigo = req.params.codigo;
  
    db.query('DELETE FROM fabricante WHERE codigo=?', codigo, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al eliminar el fabricante");
      } else {
        res.send(result);
      }
    });
  });

  /**
 * *Crud prodcutos
 */

  app.post("/createProducto",(req,res)=>{
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const codigo_fabricante = req.body.codigo_fabricante;

    db.query('INSERT INTO producto(nombre,precio,codigo_fabricante) VALUE(?,?,?)',[nombre,precio,codigo_fabricante],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send("Producto registrado con exito!");
        }
    });
  });

  app.get("/productos", (req, res) => {
    db.query('SELECT * FROM producto', (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error en el servidor');
      } else {
        const productos = result;
  
        // Obtener los códigos de fabricante únicos
        const fabricanteCodigos = productos.map(producto => producto.codigo_fabricante);
        const fabricanteCodigosUnicos = [...new Set(fabricanteCodigos)];
  
        // Consultar los nombres de fabricante correspondientes a los códigos
        db.query('SELECT codigo, nombre FROM fabricante WHERE codigo IN (?)', [fabricanteCodigosUnicos], (err, fabricantes) => {
          if (err) {
            console.log(err);
            res.status(500).send('Error en el servidor');
          } else {
            // Crear un mapa de códigos de fabricante a nombres de fabricante para facilitar la asignación
            const fabricanteMap = {};
            fabricantes.forEach(fabricante => {
              fabricanteMap[fabricante.codigo] = fabricante.nombre;
            });
  
            // Reemplazar los códigos de fabricante con los nombres de fabricante en los productos
            const productosConFabricante = productos.map(producto => {
              return {
                ...producto,
                nombre_fabricante: fabricanteMap[producto.codigo_fabricante]
              };
            });
  
            res.send(productosConFabricante);
          }
        });
      }
    });
  });

  app.put("/updateProd", (req, res) => {
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const codigo_fabricante = req.body.codigo_fabricante;

  
    db.query('UPDATE producto SET nombre=? precio=? codigo_fabricante=? WHERE codigo=?', [nombre,precio,codigo_fabricante, codigo], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar el producto");
      } else {
        res.send("Producto actualizado con éxito");
      }
    });
  });
  
  app.delete("/deleteProd/:codigo", (req, res) => {
    const codigo = req.params.codigo;
  
    db.query('DELETE FROM producto WHERE codigo=?', codigo, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al eliminar el producto");
      } else {
        res.send(result);
      }
    });
  });

  /**
   * *Funciones Dashboard
   */

  app.get("/productos/count", (req, res) => {
    db.query('SELECT COUNT(*) AS total FROM producto', (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error en el servidor');
      } else {
        const count = result[0].total;
        res.send({ count });
      }
    });
  });

  app.get("/fabricantes/count", (req, res) => {
    db.query('SELECT COUNT(*) AS total FROM fabricante', (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error en el servidor');
      } else {
        const count = result[0].total;
        res.send({ count });
      }
    });
  });
  
  


app.listen(3001,()=>{
    console.log("Running on port 3001")
})