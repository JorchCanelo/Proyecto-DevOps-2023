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
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

    connection.query('INSERT INTO usuarios SET ?', { username: username, email: email, password: password, lastLoginDate, createdDate: createdDate }, async (error, results) => {
        
        try{
            if(error.code === 'ER_DUP_ENTRY'){
                debug.warn(`Error de validacion: La entrada ${obfuscateSensitiveData(email)} no es válida`);
                res.status(400).json({ error: `${email} no válido.` });
            }else{
                res.json('Registro exitoso.')
            }
        }catch (catchError){
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
    logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

    // Loggear body de la llamada en DEBUG
    debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

    connection.query(query, (error, results, fields) => {
        try {
            if (error) {
                logger.error(error.stack || error);
                if(error.code === 'ER_DUP_ENTRY'){
                    debug.warn(`Error de validacion: El usuario con email ${obfuscateSensitiveData(email)} no existe.`);
                    res.status(400).json({ error: `El usuario con email ${email} no existe.` });
                }
                return res.status(500).json({ error });
            }

            const user = results[0];

            if (!user) {
                debug.warn(`Error de validacion: El usuario con email ${obfuscateSensitiveData(email)} no existe.`);
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
router.get('/usuarios', authorizer.verificarToken, (req, res) => {
    connection.query(`SELECT * FROM usuarios`, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        } else {
            res.json(results);
        }
    });
});

// Obtener usuario por id
router.get('/usuarios/:id', authorizer.verificarToken, (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM usuarios WHERE id = ?', [id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error al obtener el usuario' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            res.json(results[0]);
        }
    });
});

// Actualizar datos de usuario
router.put('/usuarios/:id', authorizer.verificarToken, (req, res) => {
    const id = req.params.id;
    const { username, email, password } = req.body;
    const updatedUser = { username, email, password };
    connection.query('UPDATE usuarios SET ? WHERE id = ?', [updatedUser, id], (error, result) => {
        if (error) {
            res.status(500).json({ error: 'Error al actualizar el usuario' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            updatedUser.id = id;
            res.json(updatedUser);
        }
    });
});

// Eliminar usuario
router.delete('/usuarios/:id', authorizer.verificarToken, (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM usuarios WHERE id = ?', [id], (error, result) => {
        if (error) {
            res.status(500).json({ error: 'Error al eliminar el usuario' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            res.sendStatus(204);
        }
    });
});

module.exports = router;
