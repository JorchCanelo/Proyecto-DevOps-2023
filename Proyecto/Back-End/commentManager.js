const express = require('express');
const router = express.Router();
const connection = require('./dbConnection');
const auth = require('./auth');

//Comentarios

router.get('/comentarios', auth.verificarToken, (req, res) => {
	connection.query('SELECT * FROM comentarios', (err, rows, fields) => {
		if (!err)
			res.send(rows);
		else
			console.log(err);
	})
});

router.get('/comentarios/:id', auth.verificarToken, (req, res) => {
	connection.query('SELECT * FROM comentarios WHERE id = ?', [req.params.id], (err, rows, fields) => {
		if (!err)
			res.send(rows);
		else
			console.log(err);
	})
});

router.post('/comentarios', auth.verificarToken, (req, res) => {
	let comentario = req.body;
	var sql = "INSERT INTO comentarios (autor, contenido, fecha, estado, tarea_asociada) VALUES (?, ?, ?, ?, ?)";
	connection.query(sql, [comentario.autor, comentario.contenido, comentario.fecha, comentario.estado, comentario.tarea_asociada], (err, rows, fields) => {
		if (!err)
			res.send("Comentario agregado exitosamente.");
		else
			console.log(err);
	})
});

router.put('/comentarios/:id', auth.verificarToken, (req, res) => {
	let comentario = req.body;
	var sql = "UPDATE comentarios SET autor = ?, contenido = ?, fecha = ?, estado = ?, tarea_asociada = ? WHERE id = ?";
	connection.query(sql, [comentario.autor, comentario.contenido, comentario.fecha, comentario.estado, comentario.tarea_asociada, req.params.id], (err, rows, fields) => {
		if (!err)
			res.send("Comentario actualizado exitosamente.");
		else
			console.log(err);
	})
});

router.delete('/comentarios/:id', auth.verificarToken, (req, res) => {
	connection.query('DELETE FROM comentarios WHERE id = ?', [req.params.id], (err, rows, fields) => {
		if (!err)
			res.send("Comentario eliminado exitosamente.");
		else
			console.log(err);
	})
});

module.exports = router;