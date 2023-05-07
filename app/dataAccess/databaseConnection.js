require('dotenv').config();
const mysql = require('mysql2');

//* Conexión local a base de datos
// const connection = mysql.createConnection(({
//     host: 'localhost',
//     user: 'Kanin',
//     password: '123',
//     database: 'agenda'
// }));


//* Conexión a nube de la base de datos
const connection = mysql.createConnection(process.env.DATABASE_URL);
console.log('Connected to PlanetScale!');
connection.end();


connection.connect((error) =>{
    if(error){
        console.error(error);
        return;
    }else{
        console.log('Conexión existosa');
    }
});

module.exports = connection;