const http = require('http');
const data = JSON.stringify({
  email: 'testuser+1@example.com',
  password: 'Pass123!',
  name: 'Test User',
  oabNumber: '123456',
  specialty: 'Civil',
});

const req = http.request(
  'http://localhost:3333/api/register',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  },
  (res) => {
    console.log(res.statusCode, res.statusMessage);
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      console.log(body);
      process.exit(0);
    });
  }
);

req.on('error', (e) => {
  console.error('request error', e.message);
  process.exit(1);
});

req.write(data);
req.end();
