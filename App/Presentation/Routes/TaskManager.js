const express = require('express');
const router = express.Router();
const connection = require('../../DataAccess/DBConnection');
const authorizer = require('../../DataAccess/Authorizer');

//Tareas

router.get('/tareas', authorizer.verificarToken, (req, res) => {
	connection.query('SELECT * FROM tareas', (err, rows, fields) => {
		if (!err)
			res.json({ rows });
		else
			res.status(500).json({ error });
	})
});

router.get('/tareas/:id', authorizer.verificarToken, (req, res) => {
	connection.query('SELECT * FROM tareas WHERE id = ?', [req.params.id], (err, rows, fields) => {
		if (!err)
			res.json({ rows });
		else
			res.status(500).json({ error });
	})
});

router.post('/tareas', authorizer.verificarToken, (req, res) => {
	let tarea = req.body;
	var sql = "INSERT INTO tareas (nombre, descripcion, estado, fecha_entrega, proyecto_asociado) VALUES (?, ?, ?, ?, ?)";
	connection.query(sql, [tarea.nombre, tarea.descripcion, tarea.estado, tarea.fecha_entrega, tarea.proyecto_asociado], (err, rows, fields) => {
		if (!err)
			res.json({ message: 'Tarea agregada exitosamente.' });
		else
			res.status(500).json({ error });
	})
});

router.put('/tareas/:id', authorizer.verificarToken, (req, res) => {
	let tarea = req.body;
	var sql = "UPDATE tareas SET nombre = ?, descripcion = ?, estado = ?, fecha_entrega = ?, proyecto_asociado = ? WHERE id = ?";
	connection.query(sql, [tarea.nombre, tarea.descripcion, tarea.estado, tarea.fecha_entrega, tarea.proyecto_asociado, req.params.id], (err, rows, fields) => {
		if (!err)
			res.json({ message: 'Tarea actualizada exitosamente.' });
		else
			res.status(500).json({ error });
	})
});

router.delete('/tareas/:id', authorizer.verificarToken, (req, res) => {
	connection.query('DELETE FROM tareas WHERE id = ?', [req.params.id], (err, rows, fields) => {
		if (error) {
			res.status(500).json({ error });
		} else if (results.affectedRows === 0) {
			res.status(404).json({ message: 'Tarea no encontrada' });
		} else {
			res.json({ message: 'Tarea eliminada' });
		}
	})
});

module.exports = router;
