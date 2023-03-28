const express = require('express');
const app = express();

const puerto = process.env.PORT || 5000;

var estudiantes = [
	{nombre:'Jesus', matricula:'a16001674'},
	{nombre:'Juan', matricula:'a16001675'},
	{nombre:'Pedro', matricula:'a16001676'},
];

app.get('/estudiantes', (req, res) =>
	res.json(estudiantes)
);

app.listen(puerto, () => console.log(`app listening on http://localhost:${puerto}`) );

module.exports = app;