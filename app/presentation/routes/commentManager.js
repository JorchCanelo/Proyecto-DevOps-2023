const express = require('express');
const router = express.Router();
const connection = require('../../dataAccess/databaseConnection');
const authorizer = require('../../dataAccess/authorizer');

//Comentarios

router.get('/comentarios', authorizer.verificarToken, (req, res) => {
	connection.query('SELECT * FROM comentarios', (err, rows, fields) => {
		if (!err)
			res.json({ rows });
		else
			res.status(500).json({ error });
	})
});

router.get('/comentarios/:id', authorizer.verificarToken, (req, res) => {
	connection.query('SELECT * FROM comentarios WHERE id = ?', [req.params.id], (err, rows, fields) => {
		if (!err)
			res.json({ rows });
		else
			res.status(500).json({ error });
	})
});

router.post('/comentarios', authorizer.verificarToken, (req, res) => {
	let comentario = req.body;
	var sql = "INSERT INTO comentarios (autor, contenido, fecha, estado, tarea_asociada) VALUES (?, ?, ?, ?, ?)";
	connection.query(sql, [comentario.autor, comentario.contenido, comentario.fecha, comentario.estado, comentario.tarea_asociada], (err, rows, fields) => {
		if (!err)
			res.json({ message: 'Comentario agregado exitosamente.' });
		else
			res.status(500).json({ error });
	})
});

router.put('/comentarios/:id', authorizer.verificarToken, (req, res) => {
	let comentario = req.body;
	var sql = "UPDATE comentarios SET autor = ?, contenido = ?, fecha = ?, estado = ?, tarea_asociada = ? WHERE id = ?";
	connection.query(sql, [comentario.autor, comentario.contenido, comentario.fecha, comentario.estado, comentario.tarea_asociada, req.params.id], (err, rows, fields) => {
		if (!err)
			res.json({ message: 'Comentario actualizado exitosamente.' });
		else
			res.status(500).json({ error });
	})
});

router.delete('/comentarios/:id', authorizer.verificarToken, (req, res) => {
	connection.query('DELETE FROM comentarios WHERE id = ?', [req.params.id], (err, rows, fields) => {
		if (error) {
			res.status(500).json({ error });
		} else if (results.affectedRows === 0) {
			res.status(404).json({ message: 'Comentario no encontrado' });
		} else {
			res.json({ message: 'Comentario eliminado' });
		}
	})
});

module.exports = router;
