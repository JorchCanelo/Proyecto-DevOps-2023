const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const connection = require('./dbConnection');
const session = require('express-session');

//Registrar usuario
router.post('/register', (req, res) => {
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	const date = new Date();
	const createdDate = date.toLocaleString();

	connection.query('INSERT INTO usuarios SET ?', {username: username, email: email, password: password, createdDate: createdDate}, async(error, results) => {
		if(error){
			console.log(error);
		}else{
			console.log('Registro exitoso');
			return res.redirect('/');
		}
	})
	
});

// Obtener datos de todos los usuarios
router.get('/usuarios', (req, res) => {
    connection.query('SELECT * FROM usuarios', (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        } else {
            res.json(results);
        }
    });
});

// Obtener usuario por id
router.get('/usuarios/:id', (req, res) => {
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
router.put('/usuarios/:id', (req, res) => {
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
router.delete('/usuarios/:id', (req, res) => {
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