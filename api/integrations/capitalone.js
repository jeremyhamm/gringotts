const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const express = require('express');
const router = express.Router();
const axios = require('axios');

const parseCsv = (file) => {
  const filePath = path.parse(file);

  console.log(filePath);
  
  fs.readFileSync(new URL(file), 'utf8', (err, data) => {
    console.log(data);
  });
  
  // fs.createReadStream(file)
  //   .pipe(csv())
  //   .on('data', (data) => results.push(data))
  //   .on('end', () => {
  //     console.log(results);
  //   });
}

/**
 * Get access token from Capital One
 * https://developer.capitalone.com/documentation/o-auth
 * 
 * @return {Promise}
 */
const authenticate = async () => {
  const data = new URLSearchParams();
  data.append('client_id', process.env.CAPITAL_ONE_CLIENT_ID);
  data.append('client_secret', process.env.CAPITAL_ONE_CLIENT_SECRET);
  data.append('grant_type',  'client_credentials');
  
  const headers = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }

  return await axios.post('https://api-sandbox.capitalone.com/oauth2/token', data, headers);
};

/**
 * Get bank products
 */
const products = async () => {
  const data = {
    'isCollapseRate': true
  }
  
  const headers = {
    headers: {
      'Authorization': 'Bearer',
      'Content-Type': 'application/json'
    }
  };

  return await axios.post('https://api-sandbox.capitalone.com/deposits/products/~/search', data, headers);
};

/**
 * Routes
 */

/**
 * Authenicate
 */
router.get('/authentication', async (req, res) => {
  try {
    const token = await authenticate();
    console.log(token.data);

    res.sendStatus(200);
  }
  catch(err) {
    console.error(err);
  }
});

/**
 * Bank products
 */
router.get('/products', async (req, res) => {
  const products = await products();
  console.log(products);
  
  try {
    res.sendStatus(200);
  }
  catch(err) {
    console.error(err);
  }
});

/**
 * Import CSV
 */
router.get('/csv', async (req, res) => {
  const file = req.query.file;
  const csvData = await parseCsv(file);
  
  try {
    res.sendStatus(200);
  }
  catch(err) {
    console.error(err);
  }
});

module.exports = router;