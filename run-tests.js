const { DebugBear } = require("debugbear");

// Configuration
const API_KEY = process.env.DEBUGBEAR_API_KEY;
const PAGE_ID = process.env.DEBUGBEAR_PAGE_ID;
const BASE_URL = "https://preconnect-server.onrender.com/test";

// Generate tests from 1 to 10 preconnects in increments of 1
const START_PRECONNECTS = 1;
const MAX_PRECONNECTS = 10;
const INCREMENT = 1;
const DELAY_BETWEEN_TESTS_MS = 2000; // 2 seconds between triggers to avoid rate limits

if (!API_KEY) {
  console.error("Error: DEBUGBEAR_API_KEY environment variable is required");
  process.exit(1);
}

if (!PAGE_ID) {
  console.error("Error: DEBUGBEAR_PAGE_ID environment variable is required");
  process.exit(1);
}

const debugbear = new DebugBear(API_KEY);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  const testCount = (MAX_PRECONNECTS - START_PRECONNECTS) / INCREMENT + 1;
  console.log(`Starting ${testCount} tests with ${START_PRECONNECTS}-${MAX_PRECONNECTS} preconnects (increment: ${INCREMENT})`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Page ID: ${PAGE_ID}`);
  console.log("---");

  const results = [];
  let testNum = 0;

  for (let preconnectCount = START_PRECONNECTS; preconnectCount <= MAX_PRECONNECTS; preconnectCount += INCREMENT) {
    testNum++;
    const testUrl = `${BASE_URL}?preconnectCount=${preconnectCount}`;

    console.log(`[${testNum}/${testCount}] Testing with ${preconnectCount} preconnects...`);

    try {
      const analysis = await debugbear.pages.analyze(PAGE_ID, {
        url: testUrl,
        buildTitle: `Preconnect test: ${preconnectCount}`,
      });

      console.log(`  Triggered: ${analysis.url}`);
      results.push({
        preconnectCount,
        analysisUrl: analysis.url,
        status: "triggered",
      });
    } catch (error) {
      console.error(`  Error: ${error.message}`);
      results.push({
        preconnectCount,
        status: "error",
        error: error.message,
      });
    }

    // Wait between tests to avoid overwhelming the API
    if (preconnectCount < MAX_PRECONNECTS) {
      await sleep(DELAY_BETWEEN_TESTS_MS);
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Total tests triggered: ${results.filter((r) => r.status === "triggered").length}`);
  console.log(`Errors: ${results.filter((r) => r.status === "error").length}`);
  console.log("\nResults will be available in your DebugBear dashboard.");
}

runTests().catch(console.error);
