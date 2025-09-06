const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true, // only for azure i think
    trustServerCertificate: false,
  },
};

let poolPromise;

async function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config).catch(err => {
      poolPromise = null;
      throw err;
    });
  }
  return poolPromise;
}


async function query(queryString, params = {}) {
  const pool = await getPool();
  const request = pool.request();

  // Bind params safely
  for (const [key, value] of Object.entries(params)) {
    request.input(key, value);
  }

  return request.query(queryString);
}

module.exports = { sql, query };
