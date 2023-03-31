const express = require('express');
const router = express.Router();
const connection = require('../../DataAccess/DBConnection');
const authorizer = require('../../DataAccess/Authorizer');

//historial

router.get('/historial', authorizer.verificarToken, (req, res) => {
	connection.query('SELECT * FROM historial', (err, rows, fields) => {
		if (!err)
			res.send(rows);
		else
			console.log(err);
	})
});

router.get('/historial/:id', authorizer.verificarToken, (req, res) => {
	connection.query('SELECT * FROM historial WHERE proyecto_asignado = ?', [req.params.id], (err, rows, fields) => {
		if (!err)
			res.send(rows);
		else
			console.log(err);
	})
});

router.post('/historial', authorizer.verificarToken, (req, res) => {
	let registro = req.body;
	var sql = "INSERT INTO historial (fecha_cambio, detalle_cambio, responsable, proyecto_asignado) VALUES (?, ?, ?, ?)";
	connection.query(sql, [registro.fecha_cambio, registro.detalle_cambio, registro.responsable, registro.proyecto_asignado], (err, rows, fields) => {
		if (!err)
			res.send("Registro de historial agregado exitosamente.");
		else
			console.log(err);
	})
});

router.put('/historial/:id', authorizer.verificarToken, (req, res) => {
	let registro = req.body;
	var sql = "UPDATE historial SET fecha_cambio = ?, detalle_cambio = ?, responsable = ?, proyecto_asignado = ? WHERE id = ?";
	connection.query(sql, [registro.fecha_cambio, registro.detalle_cambio, registro.responsable, registro.proyecto_asignado, req.params.id], (err, rows, fields) => {
		if (!err)
			res.send("Registro de historial actualizado exitosamente.");
		else
			console.log(err);
	})
});

router.delete('/historial/:id', authorizer.verificarToken, (req, res) => {
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