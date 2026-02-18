const { DebugBear } = require("debugbear");

// Configuration
const API_KEY = process.env.DEBUGBEAR_API_KEY;
const PAGE_ID = process.env.DEBUGBEAR_PAGE_ID;
const BASE_URL = "https://preconnect-server.onrender.com/test";

// Generate 100 test points from 0 to 500 preconnects
const TEST_COUNT = 100;
const MAX_PRECONNECTS = 500;
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
  console.log(`Starting ${TEST_COUNT} tests with 0-${MAX_PRECONNECTS} preconnects`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Page ID: ${PAGE_ID}`);
  console.log("---");

  const results = [];

  for (let i = 0; i < TEST_COUNT; i++) {
    // Calculate preconnect count for this test (0, 5, 10, 15, ... 500)
    const preconnectCount = Math.round((i / (TEST_COUNT - 1)) * MAX_PRECONNECTS);
    const testUrl = `${BASE_URL}?preconnectCount=${preconnectCount}`;

    console.log(`[${i + 1}/${TEST_COUNT}] Testing with ${preconnectCount} preconnects...`);

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
    if (i < TEST_COUNT - 1) {
      await sleep(DELAY_BETWEEN_TESTS_MS);
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Total tests triggered: ${results.filter((r) => r.status === "triggered").length}`);
  console.log(`Errors: ${results.filter((r) => r.status === "error").length}`);
  console.log("\nResults will be available in your DebugBear dashboard.");
}

runTests().catch(console.error);
