const mysql = require('mysql');
const express = require('express');
const app = express();
const connection = require('./dbConnection');
const auth = require('./auth');

//Proyectos

app.get('/proyectos', (req, res) => {
    connection.query('SELECT * FROM proyectos', (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    })
  });

  app.get('/proyectos/:id', (req, res) => {
    connection.query('SELECT * FROM proyectos WHERE id = ?', [req.params.id], (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    })
  });

  app.post('/proyectos', (req, res) => {
    let proyecto = req.body;
    var sql = "INSERT INTO proyectos (nombre, descripcion, materia, fecha_entrega, usuario_asignado) VALUES (?, ?, ?, ?, ?)";
    connection.query(sql, [proyecto.nombre, proyecto.descripcion, proyecto.materia, proyecto.fecha_entrega, proyecto.usuario_asignado], (err, rows, fields) => {
      if (!err)
        res.send("Proyecto agregado exitosamente.");
      else
        console.log(err);
    })
  });

  app.put('/proyectos/:id', (req, res) => {
    let proyecto = req.body;
    var sql = "UPDATE proyectos SET nombre = ?, descripcion = ?, materia = ?, fecha_entrega = ?, usuario_asignado = ? WHERE id = ?";
    connection.query(sql, [proyecto.nombre, proyecto.descripcion, proyecto.materia, proyecto.fecha_entrega, proyecto.usuario_asignado, req.params.id], (err, rows, fields) => {
      if (!err)
        res.send("Proyecto actualizado exitosamente.");
      else
        console.log(err);
    })
  });

  app.delete('/proyectos/:id', (req, res) => {
    connection.query('DELETE FROM proyectos WHERE id = ?', [req.params.id], (err, rows, fields) => {
      if (!err)
        res.send("Proyecto eliminado exitosamente.");
      else
        console.log(err);
    })
  });

  module.exports = router;