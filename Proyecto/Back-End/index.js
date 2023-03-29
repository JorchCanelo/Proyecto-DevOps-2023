const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const connection = require('./dbConnection');

const app = express();
const puerto = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: 'secret',
  resave: 'true',
  saveUnitialized: 'true',
}));

app.listen(puerto, () => console.log(`app listening on http://localhost:${puerto}`) );
