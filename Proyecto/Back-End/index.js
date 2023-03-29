const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const connection = require('./dbConnection');

const app = express();
const puerto = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Configuración de express ejs
app.set('view engine', 'ejs');
app.set('views', '../Front-End');
app.use(express.static('../Front-End'));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUnitialized: true,
}));

//Redenderización de las vistas
app.get('/', (req, res) => {
	res.render('login');
});

app.get('/signin', (req, res) => {
	res.render('signin');
});

app.post('/register', (req, res) => {
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

app.get('/proyectos', (req, res) => {
    connection.query('SELECT * FROM proyectos', (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    })
  });

  app.get('/proyectos/:id', (req, res) => {
    connection.query('SELECT * FROM proyectos WHERE id = ?', [req.params.id], (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    })
  });

  app.post('/proyectos', (req, res) => {
    let proyecto = req.body;
    var sql = "INSERT INTO proyectos (nombre, descripcion, materia, fecha_entrega, usuario_asignado) VALUES (?, ?, ?, ?, ?)";
    connection.query(sql, [proyecto.nombre, proyecto.descripcion, proyecto.materia, proyecto.fecha_entrega, proyecto.usuario_asignado], (err, rows, fields) => {
      if (!err)
        res.send("Proyecto agregado exitosamente.");
      else
        console.log(err);
    })
  });

  app.put('/proyectos/:id', (req, res) => {
    let proyecto = req.body;
    var sql = "UPDATE proyectos SET nombre = ?, descripcion = ?, materia = ?, fecha_entrega = ?, usuario_asignado = ? WHERE id = ?";
    connection.query(sql, [proyecto.nombre, proyecto.descripcion, proyecto.materia, proyecto.fecha_entrega, proyecto.usuario_asignado, req.params.id], (err, rows, fields) => {
      if (!err)
        res.send("Proyecto actualizado exitosamente.");
      else
        console.log(err);
    })
  });

  app.delete('/proyectos/:id', (req, res) => {
    connection.query('DELETE FROM proyectos WHERE id = ?', [req.params.id], (err, rows, fields) => {
      if (!err)
        res.send("Proyecto eliminado exitosamente.");
      else
        console.log(err);
    })
  });


app.listen(puerto, () => console.log(`app listening on http://localhost:${puerto}`));

