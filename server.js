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
  const enablePreconnect = req.query.preconnect === "1";

  let preconnects = "";
  if (enablePreconnect) {
    for (const domain of heaviestCertDomains) {
      preconnects += `<link rel="preconnect" href="${domain}" crossorigin>\n`;
    }
  }

  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Preconnect Test (${enablePreconnect ? "ON" : "OFF"})</title>

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
          <a href="/test">OFF</a>
          <a href="/test?preconnect=1">ON (5 heavy certs)</a>
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
        <h1>Preconnect: ${enablePreconnect ? "ON (5 domains)" : "OFF"}</h1>
        <p>
          ${enablePreconnect
            ? `Preconnecting to 5 domains with heaviest TLS cert chains (~7.5-8.3 KB each).`
            : `No preconnects. Baseline test.`}
        </p>
        <p><em>Hero image delayed 200ms to allow preconnect activity.</em></p>

        <div class="card">
          <h2>Domains</h2>
          <ul>
            ${heaviestCertDomains.map(d => `<li>${d}</li>`).join('\n            ')}
          </ul>
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
