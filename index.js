const express = require('express');
const viewRenderer = require('./app/presentation/views/viewRenderer');
const router = require('./app/presentation/routes/router');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', './app/presentation/views');
app.use(express.static('./public'));

const port = process.env.PORT;

console.log(process.env.PORT);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Renderización de vistas
renderViews(app);

//Definición de endpoints
router(app);

app.listen(port, () => console.log(`app listening on http://localhost:${port}`));

function renderViews(app) {
  app.use('/', viewRenderer);
  app.use('/signin', viewRenderer);
  app.use('/entrace', viewRenderer);
}

