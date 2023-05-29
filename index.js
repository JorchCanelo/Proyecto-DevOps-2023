const express = require('express');
const router = require('./app/presentation/routes/router');
const cors = require('cors');

require('dotenv').config();

const app = express();

const port = process.env.PORT;

console.log(process.env.PORT);

app.use(cors({ origin: 'http://192.168.1.95:81' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Definición de endpoints
router(app);

app.listen(port, () => console.log(`app listening on http://localhost:${port}`));

