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

//comentarios

app.get('/comentarios', (req, res) => {
    connection.query('SELECT * FROM comentarios', (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    })
  });

  app.get('/comentarios/:id', (req, res) => {
    connection.query('SELECT * FROM comentarios WHERE id = ?', [req.params.id], (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    })
  });

  app.post('/comentarios', (req, res) => {
    let comentario = req.body;
    var sql = "INSERT INTO comentarios (autor, contenido, fecha, estado, tarea_asociada) VALUES (?, ?, ?, ?, ?)";
    connection.query(sql, [comentario.autor, comentario.contenido, comentario.fecha, comentario.estado, comentario.tarea_asociada], (err, rows, fields) => {
      if (!err)
        res.send("Comentario agregado exitosamente.");
      else
        console.log(err);
    })
  });

  app.put('/comentarios/:id', (req, res) => {
    let comentario = req.body;
    var sql = "UPDATE comentarios SET autor = ?, contenido = ?, fecha = ?, estado = ?, tarea_asociada = ? WHERE id = ?";
    connection.query(sql, [comentario.autor, comentario.contenido, comentario.fecha, comentario.estado, comentario.tarea_asociada, req.params.id], (err, rows, fields) => {
      if (!err)
        res.send("Comentario actualizado exitosamente.");
      else
        console.log(err);
    })
  });

  app.delete('/comentarios/:id', (req, res) => {
    connection.query('DELETE FROM comentarios WHERE id = ?', [req.params.id], (err, rows, fields) => {
      if (!err)
        res.send("Comentario eliminado exitosamente.");
      else
        console.log(err);
    })
  });

  //tareas

  app.get('/tareas', (req, res) => {
    connection.query('SELECT * FROM tareas', (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    })
  });

  app.get('/tareas/:id', (req, res) => {
    connection.query('SELECT * FROM tareas WHERE id = ?', [req.params.id], (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    })
  });

  app.post('/tareas', (req, res) => {
    let tarea = req.body;
    var sql = "INSERT INTO tareas (nombre, descripcion, estado, fecha_entrega, proyecto_asociado) VALUES (?, ?, ?, ?, ?)";
    connection.query(sql, [tarea.nombre, tarea.descripcion, tarea.estado, tarea.fecha_entrega, fecha.proyecto_asociado], (err, rows, fields) => {
      if (!err)
        res.send("Tarea agregada exitosamente.");
      else
        console.log(err);
    })
  });

  app.put('/tareas/:id', (req, res) => {
    let tarea = req.body;
    var sql = "UPDATE tareas SET nombre = ?, descripcion = ?, estado = ?, fecha_entrega = ?, proyecto_asociado = ? WHERE id = ?";
    connection.query(sql, [tarea.nombre, tarea.descripcion, tarea.estado, tarea.fecha_entrega, fecha.proyecto_asociado, req.params.id], (err, rows, fields) => {
      if (!err)
        res.send("Tarea actualizado exitosamente.");
      else
        console.log(err);
    })
  });

  app.delete('/tareas/:id', (req, res) => {
    connection.query('DELETE FROM tareass WHERE id = ?', [req.params.id], (err, rows, fields) => {
      if (!err)
        res.send("Tarea eliminado exitosamente.");
      else
        console.log(err);
    })
  });


app.listen(puerto, () => console.log(`app listening on http://localhost:${puerto}`));

