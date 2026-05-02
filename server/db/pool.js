const { Pool } = require('pg');
require('dotenv').config();

// 2. Replace hard-coded values with `process.env`
const devConfig = {
host: process.env.PGHOST,
port: process.env.PGPORT,
//user: process.env.PGUSER,
//password: process.env.PGPASSWORD,
database: process.env.PGDATABASE,
};

// 3. Create this separate config for production environments where we'll have a connection string
const prodConfig = {
    connectionString: process.env.PG_CONNECTION_STRING,
};

const pool = new Pool({
    database: process.env.DB_NAME,
});

module.exports = pool;
