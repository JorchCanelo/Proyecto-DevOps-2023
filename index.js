const express = require('express');
const router = require('./app/presentation/routes/router');

require('dotenv').config();

const app = express();


const port = process.env.PORT;

console.log(process.env.PORT);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Definición de endpoints
router(app);

app.listen(port, () => console.log(`app listening on http://localhost:${port}`));

