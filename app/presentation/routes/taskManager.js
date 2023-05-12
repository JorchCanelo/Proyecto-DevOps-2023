const express = require('express');
const router = express.Router();
const connection = require('../../dataAccess/databaseConnection');
const authorizer = require('../../dataAccess/authorizer');
const { logger, debug, obfuscateSensitiveData } = require('../../dataAccess/logger');

//Tareas

router.get('/tareas', authorizer.verificarToken, (req, res) => {

    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

    connection.query('SELECT * FROM tareas', (error, results) => {
        try {
            if (error) {
                logger.error(error.stack || error);
                res.status(500).json({ error: 'Error al obtener tareas' });
            } else {
                res.json(results);
            }
        } catch (catchError) {
            logger.error(error.stack || catchError);
            res.status(500).json({ catchError: 'Error al obtener tareas' });
        }
    });
});

router.get('/tareas/:id', authorizer.verificarToken, (req, res) => {
    const id = req.params.id;

    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

    connection.query('SELECT * FROM tareas WHERE id = ?', [id], (error, results) => {

        try {
            if (error) {
                logger.error(error.stack || error);
                res.status(500).json({ error: 'Error al obtener la tarea' });
            } else if (results.length === 0) {
                debug.warn(`Error de validacion: La tarea con el id ${id} no existe.`);
                res.status(404).json({ error: 'Tarea no encontrada' });
            } else {
                res.json(results[0]);
            }
        } catch (catchError) {
            logger.error(error.stack || catchError);
            res.status(500).json({ catchError: 'Error al obtener la tarea solicitada' });
        }
    });
});


router.post('/tareas', authorizer.verificarToken, (req, res) => {
    const tarea = req.body;
    var sql = "INSERT INTO tareas SET ?";

    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

    connection.query(sql, { nombre: tarea.nombre, descripcion: tarea.descripcion, estado: tarea.estado, fecha_entrega: tarea.fecha_entrega, proyecto_asociado: tarea.proyecto_asociado }, async (error, results) => {
        try {
            if (error) {
                debug.warn(`Error de validacion: La entrada ${obfuscateSensitiveData(tarea.nombre)} no es válida`);
                res.status(400).json({ error: `${tarea.nombre} no válido.` });
            } else {
                res.json('Registro exitoso.')
            }
        } catch (catchError) {
            logger.error(catchError.stack || catchError);
            res.status(500).json({ error: catchError });
        }

    })

});

router.put('/tareas/:id', authorizer.verificarToken, (req, res) => {
    const id = req.params.id;
    var sql = "UPDATE usuarios SET ? WHERE id = ?";
    const { nombre, descripcion, estado, fecha_entrega, proyecto_asociado } = req.body;
    const updatedTask = { nombre, descripcion, estado, fecha_entrega, proyecto_asociado };

    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

    connection.query(sql, [updatedTask, id], (error, result) => {
        try {
            if (error) {
                logger.error(error.stack || error);
                res.status(500).json({ error: 'Error al actualizar tarea' });
            } else if (result.affectedRows === 0) {
                debug.warn(`Error de validacion: La tarea con el id ${id} no existe.`);
                res.status(404).json({ error: 'Tarea no encontrada' });
            } else {
                updatedTask.id = id;
                res.json(updatedTask);
            }
        } catch (catchError) {
            logger.error(error.stack || catchError);
            res.status(500).json({ catchError: 'Error al obtener la tarea' });
        }
    });
});


router.delete('/tareas/:id', authorizer.verificarToken, (req, res) => {
    const id = req.params.id;

    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

    connection.query('DELETE FROM tareas WHERE id = ?', [id], (error, result) => {
        try {
            if (error) {
                logger.error(error.stack || error);
                res.status(500).json({ error: 'Error al eliminar la tarea' });
            } else if (result.affectedRows === 0) {
                debug.warn(`Error de validacion:La tarea con el id ${id} no existe.`);
                res.status(404).json({ error: 'Tarea no encontrada' });
            } else {
                res.sendStatus(204);
            }
        } catch (catchError) {
            logger.error(error.stack || catchError);
            res.status(500).json({ catchError: 'Error al obtener la tarea solicitada' });
        }
    });
});

module.exports = router;
