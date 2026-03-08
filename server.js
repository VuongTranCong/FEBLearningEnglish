/**
 * Local dev server: serves the app + /api/pdf proxy (same as Vercel) for faster debug.
 * Run: node server.js   then open http://localhost:3000
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname);

const MIMES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf'
};

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  const mime = MIMES[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}

function proxyPdf(res, id) {
  if (!id || !/^[\w\-]+$/.test(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing or invalid id' }));
    return;
  }
  const driveUrl = 'https://drive.google.com/uc?export=download&id=' + id;
  fetch(driveUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LearnEnglish-Quiz/1.0)' },
    redirect: 'follow'
  })
    .then((response) => {
      if (!response.ok) {
        res.writeHead(response.status);
        res.end('Drive returned an error');
        return;
      }
      return response.arrayBuffer();
    })
    .then((buffer) => {
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=3600'
      });
      res.end(Buffer.from(buffer));
    })
    .catch((err) => {
      console.error('PDF proxy error:', err.message);
      res.writeHead(502);
      res.end('Could not fetch PDF');
    });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  const query = parsed.query;

  if (req.method === 'GET' && pathname === '/api/pdf') {
    proxyPdf(res, query.id);
    return;
  }

  let filePath = path.join(ROOT, pathname === '/' ? '' : pathname);

  if (pathname === '/' || pathname === '/daily' || pathname === '/daily/') {
    filePath = path.join(ROOT, 'daily', 'index.html');
  } else if (!path.extname(filePath)) {
    const withIndex = path.join(filePath, 'index.html');
    if (fs.existsSync(withIndex)) filePath = withIndex;
  }

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    serveFile(res, filePath);
  });
});

server.listen(PORT, () => {
  console.log('Local dev server: http://localhost:' + PORT);
  console.log('  - App (daily page): http://localhost:' + PORT + '/');
  console.log('  - API proxy /api/pdf?id=... works here for quiz PDFs.');
});
