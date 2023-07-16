const express = require('express');
const mysql = require('mysql');
require('dotenv').config();

// MySQL database configuration
const dbConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
};

const app = express();

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Route to display characters table in HTML
app.get('/', (req, res) => {
  // Get characters from MySQL table
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      res.status(500).send('Error connecting to the database');
      return;
    }

    connection.query('SELECT * FROM Characters', (error, results) => {
      connection.release(); // Release the connection

      if (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).send('Error executing the query');
        return;
      }

      // Render HTML page with characters table
      const html = `
        <html>
        <head>
          <title>Characters Table</title>
        </head>
        <body>
          <h1>Characters Table</h1>
          <table>
            <tr>
              <th>filename</th>
              <th>character counts</th>
            </tr>
            ${results.map((row) => `
              <tr>
                <td>${row.filename}</td>
                <td>${row.character_counts}</td>
              </tr>
            `).join('')}
          </table>
        </body>
        </html>
      `;

      res.send(html);
    });
  });
});

// Start the server
app.listen(8080, () => {
  console.log('Server listening on port 8080');
});
