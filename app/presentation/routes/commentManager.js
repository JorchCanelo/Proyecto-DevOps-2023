const express = require('express');
const router = express.Router();
const connection = require('../../dataAccess/databaseConnection');
const authorizer = require('../../dataAccess/authorizer');
const { logger, debug, obfuscateSensitiveData } = require('../../dataAccess/logger');

//comments

router.get('/comments/getAll', authorizer.verificarToken, (req, res) => {


    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

    connection.query('SELECT * FROM comentarios', (error, results) => {
        try {
            if (error) {
                logger.error(error.stack || error);
                res.status(500).json({ error: 'Error al obtener comentario' });
            } else {
                res.json(results);
            }
        } catch (catchError) {
            logger.error(error.stack || catchError);
            res.status(500).json({ catchError: 'Error al obtener comentario' });
        }
    });
});

router.get('/comments/getComment/:id', authorizer.verificarToken, (req, res) => {
    const id = req.params.id;

    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

    connection.query('SELECT * FROM comentarios WHERE id = ?', [id], (error, results) => {
        try {
            if (error) {
                logger.error(error.stack || error);
                res.status(500).json({ error: 'Error al obtener comentario' });
            } else if (results.length === 0) {
                debug.warn(`Error de validacion: El comentario con el id ${id} no existe.`);
                res.status(404).json({ error: 'Comentario no encontrado' });
            } else {
                res.json(results[0]);
            }
        } catch (catchError) {
            logger.error(error.stack || catchError);
            res.status(500).json({ catchError: 'Error al obtener el comentario solicitado' });
        }
    });
});

router.post('/comments/addComment', authorizer.verificarToken, (req, res) => {
    let comentario = req.body;
    var sql = "INSERT INTO comentarios SET ?";

    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);
    connection.query(sql, { autor: comentario.autor, contenido: comentario.contenido, fecha: comentario.fecha, estado: comentario.estado, tarea_asociada: comentario.tarea_asociada }, async (error, results) => {
        try {
            if (error) {
                debug.warn(`Error de validacion: La entrada no es válida`);
                res.status(400).json({ error: `Comentario no válido.` });
            } else {
                res.json('Registro exitoso.')
            }
        } catch (catchError) {
            logger.error(catchError.stack || catchError);
            res.status(500).json({ error: catchError });
        }

    })

});

router.put('/comments/update/:id', authorizer.verificarToken, (req, res) => {
    const id = req.params.id;
    var sql = "UPDATE comentarios SET ? WHERE id = ?";
    const { autor, contenido, fecha, estado, tarea_asociada } = req.body;
    const updatedComment = { autor, contenido, fecha, estado, tarea_asociada };

    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

    connection.query(sql, [updatedComment, id], (error, result) => {
        try {
            if (error) {
                logger.error(error.stack || error);
                res.status(500).json({
                    error: 'Error al actualizar comentario' });
                } else if (result.affectedRows === 0) {
                    debug.warn(`Error de validacion: El comentario con el id ${id} no existe.`);
                    res.status(404).json({ error: 'Comentario no encontrado' });
                } else {
                    updatedComment.id = id;
                    res.json(updatedComment);
                }
            } catch (catchError) {
                logger.error(error.stack || catchError);
                res.status(500).json({ catchError: 'Error al obtener comentario' });
            }
        });
});

router.delete('/comments/delete/:id', authorizer.verificarToken, (req, res) => {
    const id = req.params.id;

    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);
    connection.query('DELETE FROM comentarios WHERE id = ?', [id], (error, result) => {
        try {
            if (error) {
                logger.error(error.stack || error);
                res.status(500).json({ error: 'Error al eliminar comentario' });
            } else if (result.affectedRows === 0) {
                debug.warn(`Error de validacion:El comentario con el id ${id} no existe.`);
                res.status(404).json({ error: 'Comentario no encontrado' });
            } else {
                res.sendStatus(204);
            }
        } catch (catchError) {
            logger.error(error.stack || catchError);
            res.status(500).json({ catchError: 'Error al obtener comentario' });
        }
    });
});

module.exports = router;
