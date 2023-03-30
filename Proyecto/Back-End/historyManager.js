const mysql = require('mysql');
const express = require('express');
const app = express();
const connection = require('./dbConnection');
const auth = require('./auth');

//historial

app.get('/historial', (req, res) => {
    connection.query('SELECT * FROM historial', (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    })
  });

  app.get('/historial/:id', (req, res) => {
    connection.query('SELECT * FROM historial WHERE proyecto_asignado = ?', [req.params.id], (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    })
  });

  app.post('/historial', (req, res) => {
    let registro = req.body;
    var sql = "INSERT INTO historial (fecha_cambio, detalle_cambio, responsable, proyecto_asignado) VALUES (?, ?, ?, ?)";
    connection.query(sql, [registro.fecha_cambio, registro.detalle_cambio, registro.responsable, registro.proyecto_asignado], (err, rows, fields) => {
      if (!err)
        res.send("Registro de historial agregado exitosamente.");
      else
        console.log(err);
    })
  });

  app.put('/historial/:id', (req, res) => {
    let registro = req.body;
    var sql = "UPDATE historial SET fecha_cambio = ?, detalle_cambio = ?, responsable = ?, proyecto_asignado = ? WHERE id = ?";
    connection.query(sql, [registro.fecha_cambio, registro.detalle_cambio, registro.responsable, registro.proyecto_asignado, req.params.id], (err, rows, fields) => {
      if (!err)
        res.send("Registro de historial actualizado exitosamente.");
      else
        console.log(err);
    })
  });

  app.delete('/historial/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM historial WHERE id = ?', id, (error, results) => {
      if (error) {
        res.status(500).json({ error });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Historial no encontrado' });
      } else {
        res.json({ message: 'Historial eliminado' });
      }
    });
  });
  
  module.exports = router;