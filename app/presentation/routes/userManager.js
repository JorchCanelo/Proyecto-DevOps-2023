const express = require('express');
const router = express.Router();
const logger = require('../../dataAccess/logger');
const connection = require('../../dataAccess/databaseConnection');
const authorizer = require('../../dataAccess/authorizer');

//Registrar usuario
router.post('/register', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const date = new Date();
    const createdDate = date.toLocaleString();
    const lastLoginDate = 'Default';

    connection.query('INSERT INTO usuarios SET ?', { username: username, email: email, password: password, lastLoginDate, createdDate: createdDate }, async (error, results) => {
        if (error) {
            logger.error(`Error al registrar usuario: ${error.message}`);
            res.status(500).json({ error });
        } else {
            logger.info(`Usuario registrado correctamente: ${username}`);
            res.json({ message: 'Registro exitoso.' });
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

    connection.query(query, (error, results, fields) => {
        if (error) {
            logger.error(`Error al iniciar sesión: ${error.message}`);
            return res.status(500).json({ error });
        }

        const user = results[0];

        if (!user) {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
        }

        if (user.password == password) {

            connection.query(dateQuery, () => {

                const token = authorizer.generarToken(user);

                logger.info(`Usuario ha iniciado sesión correctamente: ${username}`);

                res.header('authorization', token).json({
                    message: 'Usuario atenticado',
                    token: token,
                });

            });

        } else {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
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
