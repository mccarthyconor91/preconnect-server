const tls = require("tls");
const zlib = require("zlib");
const { URL } = require("url");

const domains = [
  "https://www.lidl.com",
  "https://www.victoriassecret.com",
  "https://www.bread.com",
  "https://www.newegg.com",
  "https://www.google.com",
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
        let rawBytes = Buffer.alloc(0);
        let chainLength = 0;

        let current = cert;
        while (current && current.raw) {
          rawBytes = Buffer.concat([rawBytes, current.raw]);
          chainLength++;
          if (current.issuerCertificate && current.issuerCertificate !== current) {
            current = current.issuerCertificate;
          } else {
            break;
          }
        }

        // Compress with brotli (what TLS cert compression typically uses)
        const brotli = zlib.brotliCompressSync(rawBytes);
        const gzip = zlib.gzipSync(rawBytes);

        socket.destroy();
        resolve({
          hostname,
          rawSize: rawBytes.length,
          brotliSize: brotli.length,
          gzipSize: gzip.length,
          chainLength
        });
      }
    );

    socket.setTimeout(10000);
    socket.on("timeout", () => {
      socket.destroy();
      resolve({ hostname, rawSize: 0, brotliSize: 0, gzipSize: 0, chainLength: 0, error: "timeout" });
    });
    socket.on("error", (err) => {
      resolve({ hostname, rawSize: 0, brotliSize: 0, gzipSize: 0, chainLength: 0, error: err.message });
    });
  });
}

async function main() {
  console.log("Comparing raw vs compressed certificate sizes...\n");

  const results = [];
  for (const domain of domains) {
    const result = await getCertSize(domain);
    results.push(result);
  }

  console.log("=".repeat(75));
  console.log("CERTIFICATE SIZES: RAW vs COMPRESSED");
  console.log("=".repeat(75));
  console.log(
    `${"Domain".padEnd(28)} ${"Raw".padStart(8)} ${"Brotli".padStart(8)} ${"Gzip".padStart(8)} ${"Savings".padStart(10)}`
  );
  console.log("-".repeat(75));

  for (const r of results) {
    if (r.error) {
      console.log(`${r.hostname.padEnd(28)} ERROR: ${r.error}`);
    } else {
      const savings = ((1 - r.brotliSize / r.rawSize) * 100).toFixed(0);
      console.log(
        `${r.hostname.padEnd(28)} ${(r.rawSize + " B").padStart(8)} ${(r.brotliSize + " B").padStart(8)} ${(r.gzipSize + " B").padStart(8)} ${(savings + "%").padStart(10)}`
      );
    }
  }

  console.log("-".repeat(75));
  console.log("\nNote: Actual wire size depends on whether server supports RFC 8879 cert compression.");
}

main();
