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
  "https://www.mozilla.org",
  "https://www.remitly.com",
  "https://www.gitpod.io",
  "https://www.nintendo.com",
  "https://www.asda.com",
  "https://www.schwab.com",
  "https://www.missguided.com",
  "https://www.nbcnews.com",
  "https://www.imdb.com",
  "https://www.cnbc.com",
  "https://www.homedepot.com",
  "https://www.dell.com",
  "https://www.blitz.gg",
  "https://www.bethesda.net",
  "https://www.singlestore.com",
  "https://www.steepandcheap.com",
  "https://www.backcountry.com",
  "https://www.wowhead.com",
  "https://www.circleci.com",
  "https://www.robinhood.com",
  "https://www.buildkite.com",
  "https://www.500px.com",
  "https://www.pgpool.net",
  "https://www.elastic.co",
  "https://www.jetbrains.com",
  "https://www.ubisoft.com",
  "https://www.everydayhealth.com",
  "https://www.medicalnewstoday.com",
  "https://www.codeanywhere.com",
  "https://www.gemini.com",
  "https://www.threadless.com",
  "https://www.airtable.com",
  "https://www.wsj.com",
  "https://www.morrisons.com",
  "https://www.epicgames.com",
  "https://www.databricks.com",
  "https://www.blizzard.com",
  "https://www.onemedical.com",
  "https://www.lyft.com",
  "https://www.coursera.org",
  "https://www.arstechnica.com",
  "https://www.puma.com",
  "https://www.soundcloud.com",
  "https://www.okta.com",
  "https://www.healthline.com",
  "https://www.grammarly.com",
  "https://www.deviantart.com",
  "https://www.campsaver.com",
  "https://www.figma.com",
  "https://www.brooks.com",
  "https://www.instacart.com",
  "https://www.flickr.com",
  "https://www.dribbble.com",
  "https://www.cafepress.com",
  "https://www.wine.com",
  "https://www.stackblitz.com",
  "https://www.sezzle.com",
  "https://www.nike.com",
  "https://www.monzo.com",
  "https://www.asics.com",
  "https://www.surlatable.com",
  "https://www.buddy.works",
  "https://www.pulumi.com",
  "https://www.eyeem.com",
  "https://www.pixlr.com",
  "https://www.ocado.com",
  "https://www.neo4j.com",
  "https://www.lendingclub.com",
  "https://www.influxdata.com",
  "https://www.binance.com",
  "https://www.teepublic.com",
  "https://www.duolingo.com",
  "https://www.uniqlo.com",
  "https://www.codeship.com",
  "https://www.fotor.com",
  "https://www.canva.com",
  "https://www.u.gg",
  "https://www.sony.com",
  "https://www.edx.org",
  "https://www.bloomberg.com",
  "https://www.publix.com",
  "https://www.salesforce.com",
  "https://www.linkedin.com",
  "https://www.moneygram.com",
  "https://www.oldnavy.com",
  "https://www.gap.com",
  "https://www.bananarepublic.com",
  "https://www.splunk.com",
  "https://www.restorationhardware.com",
  "https://www.ign.com",
  "https://www.huffpost.com",
  "https://www.expedia.com",
  "https://www.discover.com",
  "https://www.bowflex.com",
  "https://www.visualstudio.com",
  "https://www.snapchat.com",
  "https://www.etrade.com",
  "https://www.valvesoftware.com",
  "https://www.oceanbase.com",
  "https://www.washingtonpost.com",
  "https://www.theguardian.com",
  "https://www.rockstargames.com",
  "https://www.hotels.com",
  "https://www.patagonia.com",
  "https://www.afterpay.com",
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

  // Process in batches of 15 for speed
  const batchSize = 15;
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
  console.log("TOP 50 LARGEST CERTIFICATE CHAINS");
  console.log("=".repeat(65));
  console.log(
    `${"#".padStart(3)} ${"Domain".padEnd(40)} ${"Size".padStart(10)} ${"Certs".padStart(6)}`
  );
  console.log("-".repeat(65));

  for (let i = 0; i < Math.min(50, sorted.length); i++) {
    const r = sorted[i];
    console.log(
      `${String(i + 1).padStart(3)} ${r.hostname.padEnd(40)} ${(r.totalSize + " B").padStart(10)} ${String(r.chainLength).padStart(6)}`
    );
  }

  // Output JS array for server.js
  const top50 = sorted.slice(0, 50);
  console.log("\n" + "=".repeat(65));
  console.log("COPY THIS TO server.js:");
  console.log("=".repeat(65));
  console.log("\nconst heaviestCertDomains = [");
  for (const r of top50) {
    console.log(`  "${r.domain}", // ${r.totalSize} B`);
  }
  console.log("];");

  if (errors.length > 0) {
    console.log(`\n(${errors.length} domains had errors and were excluded)`);
  }
}

main();
