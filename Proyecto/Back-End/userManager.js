const express = require('express');
const router = express.Router();
const connection = require('./dbConnection');
const auth = require('./auth');

//Registrar usuario
router.post('/register', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const date = new Date();
    const createdDate = date.toLocaleString();

    connection.query('INSERT INTO usuarios SET ?', { username: username, email: email, password: password, createdDate: createdDate }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Registro exitoso');
            return res.redirect('/');
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

    connection.query(query, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }

        const user = results[0];

        if (!user) {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
        }

        if (user.password == password) {

            connection.query(dateQuery, () => {

                const token = auth.generarToken(user);

                console.log('Usuario ingresado');

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
router.get('/usuarios', auth.verificarToken, (req, res) => {
    connection.query(`SELECT * FROM usuarios`, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        } else {
            res.json(results);
        }
    });
});

// Obtener usuario por id
router.get('/usuarios/:id', auth.verificarToken, (req, res) => {
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
router.put('/usuarios/:id', auth.verificarToken, (req, res) => {
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
router.delete('/usuarios/:id', auth.verificarToken, (req, res) => {
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