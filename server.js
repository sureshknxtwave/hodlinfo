const express = require('express');
const axios = require('axios');
const pool = require('./db'); // Import db connection

const app = express();
const PORT = 3000;

app.use(express.static('public'));

// Fetch top 10 cryptos from API and store in DB
app.get('/fetch-cryptos', async (req, res) => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const cryptos = Object.values(response.data).slice(0, 10);
   
    // Insert data into PostgreSQL
    const query = `
      INSERT INTO cryptos (name, last, buy, sell, volume, base_unit)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    for (let crypto of cryptos) {
      await pool.query(query, [
        crypto.name, crypto.last, crypto.buy,
        crypto.sell, crypto.volume, crypto.base_unit
      ]);
    }
    
    res.send('Cryptocurrency data inserted successfully!');
  } catch (error) {
    console.error('Error fetching and storing data:', error);
    res.status(500).send('Server Error');
  }
});

// Fetch stored data from PostgreSQL and send to frontend
app.get('/api/cryptos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cryptos');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
