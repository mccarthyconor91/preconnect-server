const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Top 50 largest TLS certificate chains (verified Feb 2026)
const heaviestCertDomains = [
  "https://www.lidl.com", // 8283 B
  "https://www.breadfinancial.com", // 8100 B
  "https://www.everydayhealth.com", // 7839 B
  "https://www.victoriassecret.com", // 7639 B
  "https://www.bread.com", // 7612 B
  "https://www.nordstrom.com", // 7582 B
  "https://www.safeway.com", // 7368 B
  "https://www.albertsons.com", // 7368 B
  "https://www.youtube.com", // 7208 B
  "https://www.ebay.com", // 7191 B
  "https://www.macys.com", // 7088 B
  "https://www.sainsburys.co.uk", // 6770 B
  "https://www.tesco.com", // 6752 B
  "https://www.ally.com", // 6746 B
  "https://www.pnc.com", // 6655 B
  "https://www.depositphotos.com", // 6635 B
  "https://www.roblox.com", // 6627 B
  "https://www.weibo.com", // 6435 B
  "https://www.ea.com", // 6336 B
  "https://www.runnersworld.com", // 6253 B
  "https://www.bicycling.com", // 6253 B
  "https://www.tdbank.com", // 6249 B
  "https://www.canva.com", // 6118 B
  "https://www.williams-sonoma.com", // 6025 B
  "https://www.westelm.com", // 6025 B
  "https://www.potterybarn.com", // 6025 B
  "https://www.argos.co.uk", // 5969 B
  "https://www.codeship.com", // 5840 B
  "https://www.cbsnews.com", // 5806 B
  "https://www.reuters.com", // 5797 B
  "https://www.gettyimages.com", // 5754 B
  "https://www.paypal.com", // 5731 B
  "https://www.baidu.com", // 5644 B
  "https://www.op.gg", // 5617 B
  "https://www.atlassian.com", // 5580 B
  "https://www.2k.com", // 5549 B
  "https://www.aliexpress.com", // 5531 B
  "https://www.n26.com", // 5481 B
  "https://www.pinterest.com", // 5461 B
  "https://www.target.com", // 5437 B
  "https://www.engadget.com", // 5422 B
  "https://www.marksandspencer.com", // 5369 B
  "https://www.bloomingdales.com", // 5310 B
  "https://www.amazon.com", // 5298 B
  "https://www.zazzle.com", // 5259 B
  "https://www.zelle.com", // 5248 B
  "https://www.gamestop.com", // 5245 B
  "https://www.fanatical.com", // 5244 B
  "https://www.lululemon.com", // 5232 B
  "https://www.currys.co.uk", // 5195 B
];


// Serve hero image same-origin
app.use(express.static(__dirname));

app.get("/test", (req, res) => {
  const count = Math.min(50, Math.max(0, parseInt(req.query.count || "0", 10)));
  const delay = Math.min(5000, Math.max(0, parseInt(req.query.delay || "200", 10)));
  const priority = ["low", "high", "auto"].includes(req.query.priority) ? req.query.priority : null;
  const selected = heaviestCertDomains.slice(0, count);

  let preconnects = "";
  for (const domain of selected) {
    preconnects += `<link rel="preconnect" href="${domain}" crossorigin>\n`;
  }

  const priorityAttr = priority ? ` fetchpriority="${priority}"` : "";

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
        nav { background: #111; color: white; padding: 16px 32px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
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
          <a href="/test?count=10"${count === 10 ? ' class="active"' : ''}>10</a>
          <a href="/test?count=20"${count === 20 ? ' class="active"' : ''}>20</a>
          <a href="/test?count=30"${count === 30 ? ' class="active"' : ''}>30</a>
          <a href="/test?count=40"${count === 40 ? ' class="active"' : ''}>40</a>
          <a href="/test?count=50"${count === 50 ? ' class="active"' : ''}>50</a>
        </div>
      </nav>

      <script>
        setTimeout(() => {
          const img = document.createElement('img');
          img.src = 'smallhero.jpg';
          img.width = 1600;
          img.height = 900;
          img.alt = 'Hero';
          img.className = 'hero';${priority ? `\n          img.fetchPriority = '${priority}';` : ''}
          document.getElementById('hero-container').appendChild(img);
        }, ${delay});
      </script>

      <div id="hero-container"></div>

      <div class="content">
        <h1>Preconnects: ${count}</h1>
        <p><em>Delay: ${delay}ms | Priority: ${priority || 'default'}</em></p>

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
