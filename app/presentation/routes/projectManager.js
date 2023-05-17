const express = require('express');
const router = express.Router();
const connection = require('../../dataAccess/databaseConnection');
const authorizer = require('../../dataAccess/authorizer');
const { logger, debug, obfuscateSensitiveData } = require('../../dataAccess/logger');

//projects

router.get('/projects/getAll', authorizer.verificarToken, (req, res) => {

	// Loggear llamada de la API en INFO
	logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

	// Loggear body de la llamada en DEBUG
	debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

	connection.query('SELECT * FROM proyectos', (error, results) => {
		logger.info("SELECT * FROM proyectos ");
		try {
			if (error) {
				logger.error(error.stack || error);
				res.status(500).json({ error: 'Error al obtener los proyectos' });
			} else {
				res.json(results);
			}
		} catch (catchError) {
			logger.error(error.stack || catchError);
			res.status(500).json({ catchError: 'Error al obtener los proyectos' });
		}
	});
});

router.get('/projects/getProject/:id', authorizer.verificarToken, (req, res) => {
	const id = req.params.id;

	// Loggear llamada de la API en INFO
	logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

	// Loggear body de la llamada en DEBUG
	debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

	connection.query('SELECT * FROM proyectos WHERE id = ?', [id], (error, results) => {
		logger.info("SELECT * FROM proyectos WHERE id = " + id);
		try {
			if (error) {
				logger.error(error.stack || error);
				res.status(500).json({ error: 'Error al obtener el proyecto' });
			} else if (results.length === 0) {
				debug.warn(`Error de validacion: El proyecto con el id ${id} no existe.`);
				res.status(404).json({ error: 'Proyecto no encontrado' });
			} else {
				res.json(results[0]);
			}
		} catch (catchError) {
			logger.error(error.stack || catchError);
			res.status(500).json({ catchError: 'Error al obtener el proyecto solicitado' });
		}
	});

});

router.post('/projects/addProject', authorizer.verificarToken, (req, res) => {
	const proyecto = req.body;

	var sql = "INSERT INTO proyectos SET ?";

	// Loggear llamada de la API en INFO
	logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

	// Loggear body de la llamada en DEBUG
	debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

	connection.query(sql, { nombre: proyecto.nombre, descripcion: proyecto.descripcion, materia: proyecto.materia, fecha_entrega: proyecto.fecha_entrega, usuario_asignado: proyecto.usuario_asignado }, async (error, results) => {
		logger.info("INSERT INTO proyectos SET "+ proyecto.nombre + proyecto.descripcion + proyecto.materia + proyecto.fecha_entrega, proyecto.usuario_asignado );
		try {
			if (error) {
				debug.warn(`Error de validacion: La entrada ${obfuscateSensitiveData(proyecto.nombre)} no es válida`);
				res.status(400).json({ error: `${proyecto.nombre} no válido.` });
			} else {
				res.json('Registro exitoso.')
			}
		} catch (catchError) {
			logger.error(catchError.stack || catchError);
			res.status(500).json({ error: catchError });
		}

	})

});

router.put('/projects/update/:id', authorizer.verificarToken, (req, res) => {
	const id = req.params.id;
	var sql = "UPDATE proyectos SET ? WHERE id = ?";
	const { nombre, descripcion, materia, fecha_entrega, usuario_asignado } = req.body;
	const updatedProject = { nombre, descripcion, materia, fecha_entrega, usuario_asignado };

	// Loggear llamada de la API en INFO
	logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

	// Loggear body de la llamada en DEBUG
	debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

	connection.query(sql, [updatedProject, id], (error, result) => {
		logger.info("UPDATE proyectos SET "+  nombre + descripcion + materia + fecha_entrega + usuario_asignado + "WHERE id = "+ id );
		try {
			if (error) {
				logger.error(error.stack || error);
				res.status(500).json('Error al actualizar el proyecto');
			} else if (result.affectedRows === 0) {
				debug.warn(`Error de validacion: El proyecto con el id ${id} no existe.`);
				res.status(404).json({ error: 'Proyecto no encontrado' });
			} else {
				updatedProject.id = id;
				res.json(updatedProject);
			}
		} catch (catchError) {
			logger.error(error.stack || catchError);
			res.status(500).json({ catchError: 'Error al obtener el historial' });
		}
	})

});

router.delete('/projects/delete/:id', authorizer.verificarToken, (req, res) => {
    const id = req.params.id;

	// Loggear llamada de la API en INFO
	logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

	// Loggear body de la llamada en DEBUG
	debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

	connection.query('DELETE FROM proyectos WHERE id = ?', [id], (error, result) => {
		logger.info("DELETE FROM proyectos WHERE id = "+ id);
		try {
			if (error) {
				logger.error(error.stack || error);
				res.status(500).json({ error: 'Error al eliminar el proyecto' });
			} else if (result.affectedRows === 0) {
				debug.warn(`Error de validacion:El proyecto con el id ${id} no existe.`);
				res.status(404).json({ error: 'Proyecto no encontrado' });
			} else {
				res.sendStatus(204);
			}
		} catch (catchError) {
			logger.error(error.stack || catchError);
			res.status(500).json({ catchError: 'Error al obtener el proyecto solicitado' });
		}
	});

});

module.exports = router;
