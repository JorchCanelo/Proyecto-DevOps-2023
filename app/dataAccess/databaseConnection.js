const mysql = require('mysql2');

const connection = mysql.createConnection(({
    host: 'localhost',
    user: 'Kanin',
    password: '123',
    database: 'agenda'
}));

connection.connect((error) =>{
    if(error){
        console.error(error);
        return;
    }else{
        console.log('Conexión existosa');
    }
});

module.exports = connection;