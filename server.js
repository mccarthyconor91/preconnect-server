const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Top 5 largest TLS certificate chains (verified Feb 2026)
const heaviestCertDomains = [
  "https://www.lidl.com",           // 8283 B
  "https://www.breadfinancial.com", // 8100 B
  "https://www.victoriassecret.com",// 7639 B
  "https://www.bread.com",          // 7612 B
  "https://www.nordstrom.com",      // 7582 B
];


// Serve hero image same-origin
app.use(express.static(__dirname));

app.get("/test", (req, res) => {
  const count = Math.min(5, Math.max(0, parseInt(req.query.count || "0", 10)));
  const selected = heaviestCertDomains.slice(0, count);

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
        nav a.active { background: #444; padding: 4px 8px; border-radius: 4px; }
        .hero { width: 100%; height: 80vh; object-fit: cover; display: block; }
        .content { max-width: 800px; margin: 40px auto; padding: 0 20px; }
        .card { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
      </style>
    </head>
    <body>

      <nav>
        <div>Preconnect Test</div>
        <div>
          <a href="/test?count=0"${count === 0 ? ' class="active"' : ''}>0</a>
          <a href="/test?count=1"${count === 1 ? ' class="active"' : ''}>1</a>
          <a href="/test?count=2"${count === 2 ? ' class="active"' : ''}>2</a>
          <a href="/test?count=3"${count === 3 ? ' class="active"' : ''}>3</a>
          <a href="/test?count=4"${count === 4 ? ' class="active"' : ''}>4</a>
          <a href="/test?count=5"${count === 5 ? ' class="active"' : ''}>5</a>
        </div>
      </nav>

      <script>
        // 200ms delay before injecting hero image - gives preconnects time to start
        setTimeout(() => {
          const img = document.createElement('img');
          img.src = 'smallhero.jpg';
          img.width = 1600;
          img.height = 900;
          img.alt = 'Hero';
          img.className = 'hero';
          document.getElementById('hero-container').appendChild(img);
        }, 200);
      </script>

      <div id="hero-container"></div>

      <div class="content">
        <h1>Preconnects: ${count}</h1>
        <p><em>Hero image delayed 200ms to allow preconnect activity.</em></p>

        <div class="card">
          <h2>Active Preconnects</h2>
          ${count === 0
            ? '<p>None (baseline)</p>'
            : `<ul>${selected.map(d => '<li>' + d + '</li>').join('\n            ')}</ul>`}
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
