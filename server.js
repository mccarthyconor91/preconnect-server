const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Generate 500 unique origins
const realDomains = [];
for (let i = 1; i <= 500; i++) {
  realDomains.push(`https://domain${i}.sslip.io`);
}

// Serve hero image same-origin
app.use(express.static(__dirname));

app.get("/test", (req, res) => {
  const count = parseInt(req.query.preconnectCount || "0", 10);
  const selected = realDomains.slice(0, count);

  let preconnects = "";
  for (const domain of selected) {
    preconnects += `<link rel="preconnect" href="${domain}" crossorigin>\n`;
  }

  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Preconnect Test (${count})</title>

      ${preconnects}

      <style>
        body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
        nav { background: #111; color: white; padding: 16px 32px; display: flex; justify-content: space-between; }
        nav a { color: white; text-decoration: none; margin-left: 16px; }
        .hero { width: 100%; height: 80vh; object-fit: cover; display: block; }
        .content { max-width: 800px; margin: 40px auto; padding: 0 20px; }
        .card { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
      </style>
    </head>
    <body>

      <nav>
        <div>Preconnect Test</div>
        <div>
          <a href="/test">0</a>
          <a href="/test?preconnectCount=100">100</a>
          <a href="/test?preconnectCount=300">300</a>
          <a href="/test?preconnectCount=500">500</a>
        </div>
      </nav>

      <img
        src="/hero.jpg"
        width="1600"
        height="900"
        alt="Hero"
        class="hero"
      />

      <div class="content">
        <h1>Preconnect Count: ${count}</h1>
        <p>
          This page dynamically injects ${count} preconnect hints
          while the LCP image loads from the same origin.
        </p>

        <div class="card">
          <h2>Test Section</h2>
          <p>Used to simulate normal page content.</p>
        </div>

        <div class="card">
          <h2>Another Section</h2>
          <p>More layout content.</p>
        </div>
      </div>

    </body>
  </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
