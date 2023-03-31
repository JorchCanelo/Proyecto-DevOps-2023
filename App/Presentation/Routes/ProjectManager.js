const express = require('express');
const router = express.Router();
const connection = require('../../DataAccess/DBConnection');
const authorizer = require('../../DataAccess/Authorizer');

//Proyectos

router.get('/proyectos', authorizer.verificarToken, (req, res) => {
	connection.query('SELECT * FROM proyectos', (err, rows, fields) => {
		if (!err)
			res.send(rows);
		else
			console.log(err);
	})
});

router.get('/proyectos/:id', authorizer.verificarToken, (req, res) => {
	connection.query('SELECT * FROM proyectos WHERE id = ?', [req.params.id], (err, rows, fields) => {
		if (!err)
			res.send(rows);
		else
			console.log(err);
	})
});

router.post('/proyectos', authorizer.verificarToken, (req, res) => {
	let proyecto = req.body;
	var sql = "INSERT INTO proyectos (nombre, descripcion, materia, fecha_entrega, usuario_asignado) VALUES (?, ?, ?, ?, ?)";
	connection.query(sql, [proyecto.nombre, proyecto.descripcion, proyecto.materia, proyecto.fecha_entrega, proyecto.usuario_asignado], (err, rows, fields) => {
		if (!err)
			res.send("Proyecto agregado exitosamente.");
		else
			console.log(err);
	})
});

router.put('/proyectos/:id', authorizer.verificarToken, (req, res) => {
	let proyecto = req.body;
	var sql = "UPDATE proyectos SET nombre = ?, descripcion = ?, materia = ?, fecha_entrega = ?, usuario_asignado = ? WHERE id = ?";
	connection.query(sql, [proyecto.nombre, proyecto.descripcion, proyecto.materia, proyecto.fecha_entrega, proyecto.usuario_asignado, req.params.id], (err, rows, fields) => {
		if (!err)
			res.send("Proyecto actualizado exitosamente.");
		else
			console.log(err);
	})
});

router.delete('/proyectos/:id', authorizer.verificarToken, (req, res) => {
	connection.query('DELETE FROM proyectos WHERE id = ?', [req.params.id], (err, rows, fields) => {
		if (!err)
			res.send("Proyecto eliminado exitosamente.");
		else
			console.log(err);
	})
});

module.exports = router;