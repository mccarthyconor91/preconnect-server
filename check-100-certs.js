const tls = require("tls");
const { URL } = require("url");

const domains = [
  "https://www.bread.com",
  "https://www.intel.com",
  "https://www.mayoclinic.org",
  "https://www.macys.com",
  "https://www.ebay.com",
  "https://www.tesco.com",
  "https://www.ally.com",
  "https://www.sainsburys.co.uk",
  "https://www.newegg.com",
  "https://www.bing.com",
  "https://www.depositphotos.com",
  "https://www.victoriassecret.com",
  "https://www.vultr.com",
  "https://www.lidl.com",
  "https://www.westernunion.com",
  "https://www.argos.co.uk",
  "https://www.ea.com",
  "https://www.youtube.com",
  "https://www.google.com",
  "https://www.nordstrom.com",
  "https://www.greendot.com",
  "https://www.op.gg",
  "https://www.aliexpress.com",
  "https://www.lululemon.com",
  "https://www.reuters.com",
  "https://www.alibaba.com",
  "https://www.weibo.com",
  "https://www.bloomingdales.com",
  "https://www.usbank.com",
  "https://www.microsoft.com",
  "https://www.tdbank.com",
  "https://www.wired.com",
  "https://www.newyorker.com",
  "https://www.hp.com",
  "https://www.amazon.com",
  "https://www.pnc.com",
  "https://www.klarna.com",
  "https://www.lowes.com",
  "https://www.roblox.com",
  "https://www.nvidia.com",
  "https://www.runnersworld.com",
  "https://www.bicycling.com",
  "https://www.cisco.com",
  "https://www.samsung.com",
  "https://www.airbnb.com",
  "https://www.williams-sonoma.com",
  "https://www.westelm.com",
  "https://www.potterybarn.com",
  "https://www.gitlab.com",
  "https://www.cbsnews.com",
  "https://www.baidu.com",
  "https://www.gettyimages.com",
  "https://www.adidas.com",
  "https://www.shein.com",
  "https://www.credova.com",
  "https://www.atlassian.com",
  "https://www.tripadvisor.com",
  "https://www.2k.com",
  "https://www.splitit.com",
  "https://www.paypal.com",
  "https://www.n26.com",
  "https://www.staples.com",
  "https://www.khanacademy.org",
  "https://www.gooten.com",
  "https://www.fanatical.com",
  "https://www.target.com",
  "https://www.pinterest.com",
  "https://www.zelle.com",
  "https://www.snowflake.com",
  "https://www.engadget.com",
  "https://www.webmd.com",
  "https://www.citi.com",
  "https://www.shutterstock.com",
  "https://www.bbc.com",
  "https://www.harness.io",
  "https://www.zoom.us",
  "https://www.marksandspencer.com",
  "https://www.printful.com",
  "https://www.sofi.com",
  "https://www.currys.co.uk",
  "https://www.safeway.com",
  "https://www.albertsons.com",
  "https://www.xbox.com",
  "https://www.istockphoto.com",
  "https://www.quora.com",
  "https://www.capitalone.com",
  "https://www.zazzle.com",
  "https://www.americanexpress.com",
  "https://www.bankofamerica.com",
  "https://www.oracle.com",
  "https://www.resy.com",
  "https://www.vistaprint.com",
  "https://www.telegram.org",
  "https://www.strava.com",
  "https://www.urbanoutfitters.com",
  "https://www.activision.com",
  "https://www.anthropologie.com",
  "https://www.gamestop.com",
  "https://www.freepeople.com",
  "https://www.breadfinancial.com",
];

async function getCertSize(domain) {
  const url = new URL(domain);
  const hostname = url.hostname;

  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false,
      },
      () => {
        const cert = socket.getPeerCertificate(true);
        let totalSize = 0;
        let chainLength = 0;

        let current = cert;
        while (current && current.raw) {
          totalSize += current.raw.length;
          chainLength++;
          if (current.issuerCertificate && current.issuerCertificate !== current) {
            current = current.issuerCertificate;
          } else {
            break;
          }
        }

        socket.destroy();
        resolve({ hostname, domain, totalSize, chainLength, error: null });
      }
    );

    socket.setTimeout(8000);
    socket.on("timeout", () => {
      socket.destroy();
      resolve({ hostname, domain, totalSize: 0, chainLength: 0, error: "timeout" });
    });
    socket.on("error", (err) => {
      resolve({ hostname, domain, totalSize: 0, chainLength: 0, error: err.message });
    });
  });
}

async function main() {
  console.log(`Fetching certificate chain sizes for ${domains.length} domains...\n`);

  const results = [];
  let completed = 0;

  // Process in batches of 10 for speed
  const batchSize = 10;
  for (let i = 0; i < domains.length; i += batchSize) {
    const batch = domains.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(getCertSize));
    results.push(...batchResults);
    completed += batch.length;
    process.stdout.write(`\rProgress: ${completed}/${domains.length}`);
  }

  console.log("\n");

  // Sort by size descending
  const sorted = results
    .filter((r) => !r.error)
    .sort((a, b) => b.totalSize - a.totalSize);

  const errors = results.filter((r) => r.error);

  console.log("=".repeat(65));
  console.log("TOP 20 LARGEST CERTIFICATE CHAINS");
  console.log("=".repeat(65));
  console.log(
    `${"#".padStart(3)} ${"Domain".padEnd(40)} ${"Size".padStart(10)} ${"Certs".padStart(6)}`
  );
  console.log("-".repeat(65));

  for (let i = 0; i < Math.min(20, sorted.length); i++) {
    const r = sorted[i];
    console.log(
      `${String(i + 1).padStart(3)} ${r.hostname.padEnd(40)} ${(r.totalSize + " B").padStart(10)} ${String(r.chainLength).padStart(6)}`
    );
  }

  console.log("\n" + "=".repeat(65));
  console.log("TOP 5 FOR PRECONNECT TEST:");
  console.log("=".repeat(65));

  const top5 = sorted.slice(0, 5);
  console.log("\nconst heaviestCertDomains = [");
  for (const r of top5) {
    console.log(`  "${r.domain}",  // ${r.totalSize} B`);
  }
  console.log("];");

  if (errors.length > 0) {
    console.log(`\n(${errors.length} domains had errors and were excluded)`);
  }
}

main();
