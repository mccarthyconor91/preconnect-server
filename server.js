const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// 100 real, widely-used domains
const realDomains = [
  "https://www.google.com",
  "https://www.youtube.com",
  "https://www.facebook.com",
  "https://www.instagram.com",
  "https://www.twitter.com",
  "https://www.linkedin.com",
  "https://www.amazon.com",
  "https://www.netflix.com",
  "https://www.microsoft.com",
  "https://www.apple.com",
  "https://www.cloudflare.com",
  "https://www.wikipedia.org",
  "https://www.reddit.com",
  "https://www.yahoo.com",
  "https://www.bing.com",
  "https://www.github.com",
  "https://www.stackoverflow.com",
  "https://www.tiktok.com",
  "https://www.adobe.com",
  "https://www.paypal.com",
  "https://www.salesforce.com",
  "https://www.dropbox.com",
  "https://www.spotify.com",
  "https://www.wordpress.com",
  "https://www.medium.com",
  "https://www.quora.com",
  "https://www.pinterest.com",
  "https://www.zoom.us",
  "https://www.slack.com",
  "https://www.shopify.com",
  "https://www.ebay.com",
  "https://www.twitch.tv",
  "https://www.cnn.com",
  "https://www.bbc.com",
  "https://www.nytimes.com",
  "https://www.theguardian.com",
  "https://www.forbes.com",
  "https://www.imdb.com",
  "https://www.booking.com",
  "https://www.airbnb.com",
  "https://www.uber.com",
  "https://www.lyft.com",
  "https://www.discord.com",
  "https://www.roblox.com",
  "https://www.salesforce.com",
  "https://www.ibm.com",
  "https://www.intel.com",
  "https://www.oracle.com",
  "https://www.hp.com",
  "https://www.dell.com",
  "https://www.nvidia.com",
  "https://www.tesla.com",
  "https://www.cisco.com",
  "https://www.mozilla.org",
  "https://www.okta.com",
  "https://www.stripe.com",
  "https://www.hubspot.com",
  "https://www.zendesk.com",
  "https://www.mailchimp.com",
  "https://www.canva.com",
  "https://www.figma.com",
  "https://www.atlassian.com",
  "https://www.digitalocean.com",
  "https://www.heroku.com",
  "https://www.vercel.com",
  "https://www.netlify.com",
  "https://www.cloudflarestatus.com",
  "https://www.fastly.com",
  "https://www.akamai.com",
  "https://www.target.com",
  "https://www.walmart.com",
  "https://www.bestbuy.com",
  "https://www.costco.com",
  "https://www.homedepot.com",
  "https://www.lowes.com",
  "https://www.mcdonalds.com",
  "https://www.starbucks.com",
  "https://www.nike.com",
  "https://www.adidas.com",
  "https://www.zara.com",
  "https://www.hm.com",
  "https://www.ikea.com",
  "https://www.etsy.com",
  "https://www.weibo.com",
  "https://www.baidu.com",
  "https://www.aliexpress.com",
  "https://www.alibaba.com",
  "https://www.samsung.com",
  "https://www.sony.com",
  "https://www.snapchat.com",
  "https://www.whatsapp.com",
  "https://www.telegram.org",
  "https://www.vimeo.com",
  "https://www.soundcloud.com",
  "https://www.coursera.org",
  "https://www.udemy.com",
  "https://www.khanacademy.org"
];


// Serve hero image same-origin
app.use(express.static(__dirname));

app.get("/test", (req, res) => {
  const count = parseInt(req.query.preconnectCount || "0", 10);
  const selected = realDomains.slice(0, Math.min(count, realDomains.length));


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
        src="smallhero.jpg"
        width="1600"
        height="900"
        alt="Hero"
        class="hero"
        fetchpriority="high" 
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
