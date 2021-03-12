const fs = require('fs');
const csv = require('csv-parser');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../../scripts/database');

/**
 * Add transaction id to each transaction
 * 
 * @param {Object} transactions
 * 
 * @return {Object}
 */
const addTransactionId = (transactions) => {
  for (const transaction of transactions) {
    if (transaction['Transaction Date']) {
      const transaction_id = `${transaction['Transaction Date']}${transaction.Description}${transaction.Debit}${transaction.Credit}`;
      transaction.transaction_id = Buffer.from(transaction_id).toString('base64');
    }
  }
  return transactions;
}

/**
 * Parse transactions csv file
 * 
 * @param {String} file - csv file name
 * 
 * @return {Promise}
 */
const parseCsv = (file) => {
  const filePath = `/api/integrations/capitalone/csv/${file}`;
  const transactions = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('error', error => reject(error))
      .on('data', (data) => transactions.push(data))
      .on('end', () => resolve(addTransactionId(transactions)));
  });
};

/**
 * Check for existing transactions
 * 
 * @param {JSON} transactions 
 */
const checkForExistingTransactions = async (transactions) => {
  const transactionIdArr = [];
  for (const transaction of transactions) {
    transactionIdArr.push(transaction.transaction_id);
  }

  const sql = db.getDBConnection();
  return await sql`
    select t.transaction_id
    from transactions t
    where t.transaction_id in (${ ['1', '2'] })
  `
};

/**
 * 
 * @param {*} transactions 
 */
const saveTransactions = async (transactions) => {
  const existing = await checkForExistingTransactions(transactions);

  const foundArray = [];
  for (const ext of existing) {
    foundArray.push(ext);
  }
  
  const sql = db.getDBConnection();
  return await sql`insert into transactions ${ sql(transactions, 'transaction_id', 'Transaction Date', 'Debit', 'Credit', 'Description', 'Category')}` //where transaction_id not in (${ foundArray })
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
router.post('/csv', async (req, res) => {
  const file = req.query.file;
  const csvData = await parseCsv(file);
  await saveTransactions(csvData);
  
  try {
    res.sendStatus(200);
  }
  catch(err) {
    console.error(err);
  }
});

module.exports = router;