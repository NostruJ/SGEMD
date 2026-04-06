const http = require('http');

function makeRequest(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: '3005',
      path: '/segmed' + (path.startsWith('/') ? path : '/' + path),
      method: method,
      headers: { 'Content-Type': 'application/json', ...headers }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testEndpoint() {
  const res = await makeRequest('/users/me', 'GET', null, { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzZ2VtZC5jb20iLCJyb2xlIjoiQWRtaW5pc3RyYWRvciIsInVzZXJUeXBlIjoiQWRtaW4iLCJpYXQiOjE3NzUwODQ3MzAsImV4cCI6MTc3NTAzNjkzMH0.k0L8G7L02tI2XzAxmV-sSu9e9zN8PI0dP9r0V_XOHTJ8' });
  console.log('Status:', res.status);
  console.log('Body:', JSON.stringify(res.body, null, 2));
}

testEndpoint();