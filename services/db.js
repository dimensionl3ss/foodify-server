const mysql = require('mysql2');
const config = require('../config/config');
 

const connection = mysql.createConnection(config.db);

connection.connect((error) => {
    if(error) throw error;
    const table = `create table if not exists users (name varchar(50) not null, id varchar(30) primary key, password varchar(30) not null, address varchar(300) not null, pin int not null)`;
    connection.query(table, (err) => {
        if(err) throw err;
        console.log('Table Created!');
    })
    console.log('connected successfully!!');
})

module.exports = connection;