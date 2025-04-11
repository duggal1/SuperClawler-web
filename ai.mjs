/* eslint-disable @typescript-eslint/no-require-imports */
const fetch = require('node-fetch');

const data = {
  domains: ["https://example.com"],
  max_depth: 0
};

fetch('http://127.0.0.1:8080/crawl', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));