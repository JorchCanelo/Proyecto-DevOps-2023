const express = require('express');
const router = express.Router();
const connection = require('./dbConnection');
const auth = require('./auth');

//Tareas

router.get('/tareas', auth.verificarToken, (req, res) => {
	connection.query('SELECT * FROM tareas', (err, rows, fields) => {
		if (!err)
			res.send(rows);
		else
			console.log(err);
	})
});

router.get('/tareas/:id', auth.verificarToken, (req, res) => {
	connection.query('SELECT * FROM tareas WHERE id = ?', [req.params.id], (err, rows, fields) => {
		if (!err)
			res.send(rows);
		else
			console.log(err);
	})
});

router.post('/tareas', auth.verificarToken, (req, res) => {
	let tarea = req.body;
	var sql = "INSERT INTO tareas (nombre, descripcion, estado, fecha_entrega, proyecto_asociado) VALUES (?, ?, ?, ?, ?)";
	connection.query(sql, [tarea.nombre, tarea.descripcion, tarea.estado, tarea.fecha_entrega, tarea.proyecto_asociado], (err, rows, fields) => {
		if (!err)
			res.send("Tarea agregada exitosamente.");
		else
			console.log(err);
	})
});

router.put('/tareas/:id', auth.verificarToken, (req, res) => {
	let tarea = req.body;
	var sql = "UPDATE tareas SET nombre = ?, descripcion = ?, estado = ?, fecha_entrega = ?, proyecto_asociado = ? WHERE id = ?";
	connection.query(sql, [tarea.nombre, tarea.descripcion, tarea.estado, tarea.fecha_entrega, tarea.proyecto_asociado, req.params.id], (err, rows, fields) => {
		if (!err)
			res.send("Tarea actualizada exitosamente.");
		else
			console.log(err);
	})
});

router.delete('/tareas/:id', auth.verificarToken, (req, res) => {
	connection.query('DELETE FROM tareas WHERE id = ?', [req.params.id], (err, rows, fields) => {
		if (!err)
			res.send("Tarea eliminada exitosamente.");
		else
			console.log(err);
	})
});

module.exports = router;