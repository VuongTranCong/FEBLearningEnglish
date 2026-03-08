/**
 * Proxy for Google Drive PDFs so the quiz can load them (avoids CORS).
 * GET /api/pdf?id=DRIVE_FILE_ID
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  const id = (req.query && req.query.id) || '';
  if (!id || !/^[\w\-]+$/.test(id)) {
    return res.status(400).json({ error: 'Missing or invalid id' });
  }
  const driveUrl = 'https://drive.google.com/uc?export=download&id=' + id;
  try {
    const response = await fetch(driveUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LearnEnglish-Quiz/1.0)' },
      redirect: 'follow'
    });
    if (!response.ok) {
      return res.status(response.status).send('Drive returned an error');
    }
    const contentType = response.headers.get('content-type') || 'application/pdf';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    const buffer = await response.arrayBuffer();
    return res.end(Buffer.from(buffer));
  } catch (err) {
    console.error('PDF proxy error:', err.message);
    return res.status(502).send('Could not fetch PDF');
  }
}
