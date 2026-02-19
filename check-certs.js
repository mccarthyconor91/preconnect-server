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
  "https://www.firebase.google.com",
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
        resolve({ hostname, totalSize, chainLength, error: null });
      }
    );

    socket.setTimeout(10000);
    socket.on("timeout", () => {
      socket.destroy();
      resolve({ hostname, totalSize: 0, chainLength: 0, error: "timeout" });
    });
    socket.on("error", (err) => {
      resolve({ hostname, totalSize: 0, chainLength: 0, error: err.message });
    });
  });
}

async function main() {
  console.log("Fetching certificate chain sizes...\n");

  const results = [];
  for (const domain of domains) {
    const result = await getCertSize(domain);
    results.push(result);
    const status = result.error
      ? `ERROR: ${result.error}`
      : `${result.totalSize} bytes (${result.chainLength} certs)`;
    console.log(`${result.hostname}: ${status}`);
  }

  // Sort by size descending
  const sorted = results
    .filter((r) => !r.error)
    .sort((a, b) => b.totalSize - a.totalSize);

  console.log("\n" + "=".repeat(60));
  console.log("RESULTS SORTED BY CERTIFICATE CHAIN SIZE");
  console.log("=".repeat(60));
  console.log(
    `${"Domain".padEnd(35)} ${"Size".padStart(10)} ${"Certs".padStart(6)}`
  );
  console.log("-".repeat(60));

  for (const r of sorted) {
    console.log(
      `${r.hostname.padEnd(35)} ${(r.totalSize + " B").padStart(10)} ${String(r.chainLength).padStart(6)}`
    );
  }
}

main();
