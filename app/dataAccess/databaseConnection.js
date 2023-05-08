require('dotenv').config();
const mysql = require('mysql2');

//* Conexión local a base de datos
// const connection = mysql.createConnection(({
//     host: 'localhost',
//     user: 'Kanin',
//     password: '123',
//     database: 'agenda'
// }));

//* Nuevo método de conexión
// const connection = mysql.createConnection(({
//     host: 'aws.connect.psdb.cloud',
//     user: 'peo4q88dt7ms6g9ti0xy',
//     password: 'pscale_pw_1poEbbwhYLEt8gadruQJU7UzE8gqyW5rQeYzwjgO0xI',
//     database: 'agenda',
// }));


//* Conexión a nube de la base de datos tipo nodejs
  const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((error) => {
    if (error) {
        console.error(error);
        return;
    } else {
        console.log('Conexión existosa');
    }
});

module.exports = connection;