const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'kanin',
  password: '123',
  database: 'agenda'
};

// Conexión a la base de datos
const connection = mysql.createConnection(dbConfig);

connection.connect(error => {
  if (error) throw error;
  console.log('Conexión a la base de datos establecida');
});

// Ruta para hacer login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Buscamos al usuario en la base de datos
  const query = `SELECT * FROM usuarios WHERE username = '${username}' AND password = '${password}'`;

  connection.query(query, (error, results, fields) => {
    if (error) throw error;

    if (results.length > 0) {
      // Si el usuario existe, generamos un token
      const token = jwt.sign({ id: results[0].id }, 'mi_secreto');

      // Enviamos el token al cliente
      res.json({ token });
    } else {
      // Si el usuario no existe, enviamos un mensaje de error
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
  });
});

// Ruta protegida
app.get('/protected', (req, res) => {
  // Obtenemos el token del header de la petición
  const token = req.headers.authorization.split(' ')[1];

  try {
    // Verificamos el token
    const decoded = jwt.verify(token, 'mi_secreto');
    res.json({ message: 'Bienvenido al área protegida' });
  } catch (error) {
    // Si el token no es válido, enviamos un mensaje de error
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Iniciamos el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});