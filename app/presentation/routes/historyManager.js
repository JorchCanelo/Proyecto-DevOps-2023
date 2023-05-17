const express = require('express');
const router = express.Router();
const connection = require('../../dataAccess/databaseConnection');
const authorizer = require('../../dataAccess/authorizer');
const { logger, debug, obfuscateSensitiveData } = require('../../dataAccess/logger');

//history

router.get('/history/getAll', authorizer.verificarToken, (req, res) => {
	// Loggear llamada de la API en INFO
	logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

	// Loggear body de la llamada en DEBUG
	debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

	connection.query('SELECT * FROM historial', (error, results) => {
		logger.info("SELECT * FROM historial ");
		try {
			if (error) {
				logger.error(error.stack || error);
				res.status(500).json({ error: 'Error al obtener historial' });
			} else {
				res.json(results);
			}
		} catch (catchError) {
			logger.error(error.stack || catchError);
			res.status(500).json({ catchError: 'Error al obtener historial' });
		}
	});
});



router.get('/history/getHistory/:id', authorizer.verificarToken, (req, res) => {
	const id = req.params.id;

	// Loggear llamada de la API en INFO
	logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

	// Loggear body de la llamada en DEBUG
	debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

	connection.query('SELECT * FROM historial WHERE id = ?', [id], (error, results) => {
		logger.info("SELECT * FROM historial WHERE id = " + id);
		try {
			if (error) {
				logger.error(error.stack || error);
				res.status(500).json({ error: 'Error al obtener el historial' });
			} else if (results.length === 0) {
				debug.warn(`Error de validacion: El historial con el id ${id} no existe.`);
				res.status(404).json({ error: 'Historial no encontrado' });
			} else {
				res.json(results[0]);
			}
		} catch (catchError) {
			logger.error(error.stack || catchError);
			res.status(500).json({ catchError: 'Error al obtener el historial solicitado' });
		}
	});
});

router.post('/history/addHistory', authorizer.verificarToken, (req, res) => {
	let registro = req.body;

	var sql = "INSERT INTO historial SET ?";

	// Loggear llamada de la API en INFO
	logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

	// Loggear body de la llamada en DEBUG
	debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

	connection.query(sql, { fecha_cambio: registro.fecha_cambio, detalle_cambio: registro.detalle_cambio, responsable: registro.responsable, proyecto_asignado: registro.proyecto_asignado }, async (error, results) => {
		logger.info("INSERT INTO historial SET "+ registro.fecha_cambio + registro.detalle_cambio + registro.responsable + registro.proyecto_asignado);
		try {
			if (error) {
				debug.warn(`Error de validacion: La entrada ${obfuscateSensitiveData(registro.detalle_cambio)} no es válida`);
				res.status(400).json({ error: `${registro.detalle_cambio} no válido.` });
			} else {
				res.json('Registro exitoso.')
			}
		} catch (catchError) {
			logger.error(catchError.stack || catchError);
			res.status(500).json({ error: catchError });
		}

	})
});


router.put('/history/update/:id', authorizer.verificarToken, (req, res) => {
	const id = req.params.id;
	var sql = "UPDATE historial SET ? WHERE id = ?";
	const { fecha_cambio, detalle_cambio, responsable, proyecto_asignado } = req.body;
	const updatedHistory = { fecha_cambio, detalle_cambio, responsable, proyecto_asignado };

	// Loggear llamada de la API en INFO
	logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

	// Loggear body de la llamada en DEBUG
	debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

	connection.query(sql, [updatedHistory, id], (error, result) => {
		logger.info("UPDATE historial SET "+  fecha_cambio + detalle_cambio + responsable + proyecto_asignado + "WHERE id = "+ id );
		try {
			if (error) {
				logger.error(error.stack || error);
				res.status(500).json('Error al actualizar historial');
			} else if (result.affectedRows === 0) {
				debug.warn(`Error de validacion: El historial con el id ${id} no existe.`);
				res.status(404).json({ error: 'Historial no encontrado' });
			} else {
				updatedHistory.id = id;
				res.json(updatedHistory);
			}
		} catch (catchError) {
			logger.error(error.stack || catchError);
			res.status(500).json({ catchError: 'Error al obtener el historial' });
		}
	})
});



router.delete('/history/delete/:id', authorizer.verificarToken, (req, res) => {
	const id = req.params.id;

	// Loggear llamada de la API en INFO
	logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

	// Loggear body de la llamada en DEBUG
	debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

	connection.query('DELETE FROM historial WHERE id = ?', [id], (error, result) => {
		logger.info("DELETE FROM historial WHERE id = "+ id);
		try {
			if (error) {
				logger.error(error.stack || error);
				res.status(500).json({ error: 'Error al eliminar el historial' });
			} else if (result.affectedRows === 0) {
				debug.warn(`Error de validacion:El historial con el id ${id} no existe.`);
				res.status(404).json({ error: 'Historial no encontrado' });
			} else {
				res.sendStatus(204);
			}
		} catch (catchError) {
			logger.error(error.stack || catchError);
			res.status(500).json({ catchError: 'Error al obtener el historial solicitado' });
		}
	});
});

module.exports = router;
