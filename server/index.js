const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"tienda"
});

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


app.listen(3001,()=>{
    console.log("Running on port 3001")
})