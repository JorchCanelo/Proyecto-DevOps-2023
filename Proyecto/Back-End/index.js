const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');

const app = express();

const userManager = require('./userManager');

const puerto = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Configuración de express ejs
app.set('view engine', 'ejs');
app.set('views', '../Front-End');
app.use(express.static('../Front-End'));

//Redenderización de las vistas
app.get('/', (req, res) => {
	res.render('login');
});

app.get('/signin', (req, res) => {
	res.render('signin');
});

app.use(userManager);

app.listen(puerto, () => console.log(`app listening on http://localhost:${puerto}`));
