var pg = require('pg'),
    session = require('express-session'),
    pgSession = require('connect-pg-simple')(session);

const { Pool, Client } = require('pg')
module.exports.pool = new Pool({
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
})