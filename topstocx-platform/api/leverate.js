// Vercel Serverless Function to Proxy Leverate API calls
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // The request URL on Vercel might be "/api/leverate/api/ManagementService/..."
  const requestUrl = req.url;
  const pathParts = requestUrl.split('/api/leverate/');
  if (pathParts.length < 2) {
    return res.status(400).json({ error: 'Invalid proxy path' });
  }
  
  const targetPath = pathParts[1];
  const baseUrl = process.env.LEVERATE_BASE_URL || 'https://restapi-real.sirixtrader.com:443';
  const targetUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}${targetPath}`;

  try {
    const fetchRes = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LEVERATE_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    // Parse response
    const data = await fetchRes.json();
    return res.status(fetchRes.status).json(data);
  } catch (err) {
    console.error('Leverate Proxy Error:', err);
    return res.status(500).json({ error: 'Leverate Proxy Error', message: err.message });
  }
}
