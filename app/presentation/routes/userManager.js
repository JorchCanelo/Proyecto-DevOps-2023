const express = require('express');
const router = express.Router();
const connection = require('../../dataAccess/databaseConnection');
const authorizer = require('../../dataAccess/authorizer');
const { logger, debug, obfuscateSensitiveData } = require('../../dataAccess/logger');

//Registrar usuario
router.post('/register', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const date = new Date();
    const createdDate = date.toLocaleString();
    const lastLoginDate = 'Default';

    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)}  Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

    connection.query('INSERT INTO usuarios SET ?', {username: username, email: email, password: password, lastLoginDate, createdDate: createdDate }, async (error, results) => {
        try {
            if (error) {
                debug.warn(`Error de validacion: La entrada ${obfuscateSensitiveData(email)} no es válida`);
                res.status(400).json({ error: `${email} no válido.` });
            } else {
                res.json('Registro exitoso.');
            }
        } catch (catchError) {
            logger.error(catchError.stack || catchError);
            res.status(500).json({ error: catchError });
        }

    })

});

//Iniciar sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM usuarios WHERE username = '${username}'`;
    const date = new Date();
    const loginDate = date.toLocaleString();
    const dateQuery = `UPDATE usuarios SET lastLoginDate = '${loginDate}' WHERE username = '${username}'`;

   // Loggear llamada de la API en INFO
   logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)}  Headers: ${JSON.stringify(req.headers)}`);

   // Loggear body de la llamada en DEBUG
   debug.debug(`Request body ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

    connection.query(query, (error, results, fields) => {
        try {
            if (error) {     
                if (error) {
                    debug.warn(`Error de validacion: El usuario  ${username} no existe.`);
                    res.status(400).json({ error: `El usuario ${username} no existe.` });
                }
                logger.error(error.stack || error);
                return res.status(500).json({ error });
            }

            const user = results[0];

            if (!user) {
                debug.warn(`Error de validacion: El usuario ${username} no existe.`);
                return res.status(401).json({ mensaje: "Credenciales inválidas" });
            }

            if (user.password == password) {

                connection.query(dateQuery, () => {

                    const token = authorizer.generarToken(user);

                    res.header('authorization', token).json({
                        message: 'Usuario atenticado',
                        token: token,
                    });

                });

            } else {
                return res.status(401).json({ mensaje: "Credenciales inválidas" });
            }
        } catch (catchError) {
            logger.error(catchError.stack || catchError);
            res.status(500).json({ error: catchError });
        }
    });

});

// Obtener datos de todos los usuarios
router.get('/users/getAll', authorizer.verificarToken, (req, res) => {

    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)}  Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Query parameters: ${JSON.stringify(req.query)}  Headers: ${JSON.stringify(req.headers)}`);

    connection.query(`SELECT * FROM usuarios`, (error, results) => {
        try {
            if (error) {
                logger.error(error.stack || error);
                res.status(500).json({ error: 'Error al obtener los usuarios' });
            } else {
                res.json(results);
            }
        } catch (catchError) {
            logger.error(error.stack || catchError);
            res.status(500).json({ catchError: 'Error al obtener los usuarios' });
        }
    });
});

// Obtener usuario por id
router.get('/users/getUser/:id', authorizer.verificarToken, (req, res) => {
    const id = req.params.id;

    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)}  Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Query parameters: ${JSON.stringify(req.query)}  Headers: ${JSON.stringify(req.headers)}`);

    connection.query('SELECT * FROM usuarios WHERE id = ?', [id], (error, results) => {

        try {
            if (error) {
                logger.error(error.stack || error);
                res.status(500).json({ error: 'Error al obtener el usuario solicitado' });
            } else if (results.length === 0) {
                debug.warn(`Error de validacion: El usuario con el id ${id} no existe.`);
                res.status(404).json({ error: 'Usuario no encontrado' });
            } else {
                res.json(results[0]);
            }
        } catch (catchError) {
            logger.error(error.stack || catchError);
            res.status(500).json({ catchError: 'Error al obtener el usuario solicitado' });
        }
    });
});

// Actualizar datos de usuario
router.put('/users/update/:id', authorizer.verificarToken, (req, res) => {
    const id = req.params.id;
    const { username, email, password } = req.body;
    const updatedUser = { username, email, password };

    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)}  Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

    connection.query('UPDATE usuarios SET ? WHERE id = ?', [updatedUser, id], (error, result) => {
        try {
            if (error) {
                logger.error(error.stack || error);
                res.status(500).json({ error: 'Error al actualizar el usuario' });
            } else if (result.affectedRows === 0) {
                debug.warn(`Error de validacion: El usuario con el id ${id} no existe.`);
                res.status(404).json({ error: 'Usuario no encontrado' });
            } else {
                updatedUser.id = id;
                res.json(updatedUser);
            }
        } catch (catchError) {
            logger.error(error.stack || catchError);
            res.status(500).json({ catchError: 'Error al obtener el usuario solicitado' });
        }
    });
});

// Eliminar usuario
router.delete('/users/delete/:id', authorizer.verificarToken, (req, res) => {
    const id = req.params.id;

    // Loggear llamada de la API en INFO
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)}  Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

    connection.query('DELETE FROM usuarios WHERE id = ?', [id], (error, result) => {
        try {
            if (error) {
                logger.error(error.stack || error);
                res.status(500).json({ error: 'Error al eliminar el usuario' });
            } else if (result.affectedRows === 0) {
                debug.warn(`Error de validacion: El usuario con el id ${id} no existe.`);
                res.status(404).json({ error: 'Usuario no encontrado' });
            } else {
                res.sendStatus(204);
            }
        } catch (catchError) {
            logger.error(error.stack || catchError);
            res.status(500).json({ catchError: 'Error al obtener el usuario solicitado' });
        }
    });
});

module.exports = router;
