const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",        // your pgAdmin username
    host: "localhost",
    database: "vaishnav_steel",  // the database we created
    password: "charmi2607",   // ⚠️ replace with your postgres password
    port: 5432,
});

module.exports = pool;
