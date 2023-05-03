const express = require('express');
const viewRenderer = require('./App/Presentation/Views/viewRenderer');
const router = require('./App/Presentation/Routes/Router');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', './App/Presentation/Views');
app.use(express.static('./Public'));

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

