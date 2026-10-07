const fs = require('fs');

const apiUrl = process.env.API_URL || 'http://localhost:5050/api/v1';

const content = `export const Apiurl = '${apiUrl}';\n`;

fs.writeFileSync('./.env.ts', content);
console.log('Environment file generated successfully with API URL:', apiUrl);

