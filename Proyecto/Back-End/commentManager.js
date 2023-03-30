const mysql = require('mysql');
const express = require('express');
const app = express();
const connection = require('./dbConnection');
const auth = require('./auth');

//comentarios

app.get('/comentarios', (req, res) => {
    connection.query('SELECT * FROM comentarios', (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    })
  });
  
  app.get('/comentarios/:id', (req, res) => {
    connection.query('SELECT * FROM comentarios WHERE id = ?', [req.params.id], (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    })
  });
  
  app.post('/comentarios', (req, res) => {
    let comentario = req.body;
    var sql = "INSERT INTO comentarios (autor, contenido, fecha, estado, tarea_asociada) VALUES (?, ?, ?, ?, ?)";
    connection.query(sql, [comentario.autor, comentario.contenido, comentario.fecha, comentario.estado, comentario.tarea_asociada], (err, rows, fields) => {
      if (!err)
        res.send("Comentario agregado exitosamente.");
      else
        console.log(err);
    })
  });
  
  app.put('/comentarios/:id', (req, res) => {
    let comentario = req.body;
    var sql = "UPDATE comentarios SET autor = ?, contenido = ?, fecha = ?, estado = ?, tarea_asociada = ? WHERE id = ?";
    connection.query(sql, [comentario.autor, comentario.contenido, comentario.fecha, comentario.estado, comentario.tarea_asociada, req.params.id], (err, rows, fields) => {
      if (!err)
        res.send("Comentario actualizado exitosamente.");
      else
        console.log(err);
    })
  });
  
  app.delete('/comentarios/:id', (req, res) => {
    connection.query('DELETE FROM comentarios WHERE id = ?', [req.params.id], (err, rows, fields) => {
      if (!err)
        res.send("Comentario eliminado exitosamente.");
      else
        console.log(err);
    })
  });
  module.exports = router;