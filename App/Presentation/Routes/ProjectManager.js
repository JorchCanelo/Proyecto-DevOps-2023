const express = require('express');
const router = express.Router();
const connection = require('../../DataAccess/databaseConnection');
const authorizer = require('../../DataAccess/authorizer');

//Proyectos

router.get('/proyectos', authorizer.verificarToken, (req, res) => {
	connection.query('SELECT * FROM proyectos', (err, rows, fields) => {
		if (!err)
			res.json({ rows });
		else
			res.status(500).json({ error });
	})
});

router.get('/proyectos/:id', authorizer.verificarToken, (req, res) => {
	connection.query('SELECT * FROM proyectos WHERE id = ?', [req.params.id], (err, rows, fields) => {
		if (!err)
			res.json({ rows });
		else
			res.status(500).json({ error });
	})
});

router.post('/proyectos', authorizer.verificarToken, (req, res) => {
	let proyecto = req.body;
	var sql = "INSERT INTO proyectos (nombre, descripcion, materia, fecha_entrega, usuario_asignado) VALUES (?, ?, ?, ?, ?)";
	connection.query(sql, [proyecto.nombre, proyecto.descripcion, proyecto.materia, proyecto.fecha_entrega, proyecto.usuario_asignado], (err, rows, fields) => {
		if (!err)
			res.json({ message: 'Proyecto agregado exitosamente.' });
		else
			res.status(500).json({ error });
	})
});

router.put('/proyectos/:id', authorizer.verificarToken, (req, res) => {
	let proyecto = req.body;
	var sql = "UPDATE proyectos SET nombre = ?, descripcion = ?, materia = ?, fecha_entrega = ?, usuario_asignado = ? WHERE id = ?";
	connection.query(sql, [proyecto.nombre, proyecto.descripcion, proyecto.materia, proyecto.fecha_entrega, proyecto.usuario_asignado, req.params.id], (err, rows, fields) => {
		if (!err)
			res.json({ message: 'Proyecto actualizado exitosamente.' });
		else
			res.status(500).json({ error });
	})
});

router.delete('/proyectos/:id', authorizer.verificarToken, (req, res) => {
	connection.query('DELETE FROM proyectos WHERE id = ?', [req.params.id], (err, rows, fields) => {
		if (error) {
			res.status(500).json({ error });
		} else if (results.affectedRows === 0) {
			res.status(404).json({ message: 'Proyecto no encontrado' });
		} else {
			res.json({ message: 'Proyecto eliminado' });
		}
	})
});

module.exports = router;
