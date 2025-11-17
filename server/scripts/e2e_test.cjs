const http = require('http');

const API = 'http://localhost:5000';

function request(url, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    const req = http.request(
      {
        hostname: options.hostname,
        port: options.port,
        path: options.pathname + options.search,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(body && { 'Content-Length': Buffer.byteLength(body) }),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function run() {
  try {
    console.log('--- Health check ---');
    const h = await request(`${API}/health`);
    console.log('health status:', h.status);
    console.log('health body:', h.body);

    console.log('\n--- Admin login ---');
    const adminRes = await request(`${API}/api/auth/login`, 'POST', JSON.stringify({ email: 'admin@example.com', password: 'admin123' }));
    console.log('admin login status:', adminRes.status);
    console.log('admin login body:', adminRes.body);

    console.log('\n--- Get plans ---');
    const plansRes = await request(`${API}/api/plans`);
    console.log('plans status:', plansRes.status);
    console.log('plans count:', Array.isArray(plansRes.body) ? plansRes.body.length : 'not-array');
    if (Array.isArray(plansRes.body) && plansRes.body.length > 0) {
      console.log('first plan snapshot:', plansRes.body[0]);
    }

    console.log('\n--- User login ---');
    const userRes = await request(`${API}/api/auth/login`, 'POST', JSON.stringify({ email: 'user@example.com', password: 'user123' }));
    console.log('user login status:', userRes.status);
    console.log('user login body:', userRes.body);

    if (userRes.body && userRes.body.token) {
      console.log('\n--- Get my-subscription (user) ---');
      const options = new URL(`${API}/api/my-subscription`);
      const mySubRes = await new Promise((resolve, reject) => {
        const req = http.request(
          {
            hostname: options.hostname,
            port: options.port,
            path: options.pathname,
            method: 'GET',
            headers: { Authorization: `Bearer ${userRes.body.token}` },
          },
          (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
              try {
                resolve({ status: res.statusCode, body: JSON.parse(data) });
              } catch {
                resolve({ status: res.statusCode, body: data });
              }
            });
          }
        );
        req.on('error', reject);
        req.end();
      });
      console.log('my-subscription status:', mySubRes.status);
      console.log('my-subscription body:', mySubRes.body);
    }

    console.log('\n--- E2E script finished ---');
  } catch (err) {
    console.error('E2E error:', err);
    process.exitCode = 2;
  }
}

run();
