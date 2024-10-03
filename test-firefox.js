const { chromium } = require("playwright-extra");
const stealth = require("puppeteer-extra-plugin-stealth")();
const { FingerprintGenerator } = require("fingerprint-generator");
const { newInjectedContext } = require("fingerprint-injector");

chromium.use(stealth);

const fingerprintGenerator = new FingerprintGenerator({
  browsers: [{ name: "chrome", minVersion: 88 }],
  devices: ["desktop"],
  operatingSystems: ["windows"],
});

async function crawl(url) {
  const { fingerprint } = fingerprintGenerator.getFingerprint({
    devices: ["desktop"],
    operatingSystems: ["windows"],
  });

  const browser = await chromium.launch({ headless: false });
  const context = await newInjectedContext(browser, {
    fingerprintOptions: {
      devices: ["desktop"],
      operatingSystems: ["macos"],
    },
    newContextOptions: {
      userAgent: fingerprint.navigator.userAgent,
    },
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  // 设置额外的 HTTP 头

  const page = await context.newPage();

  try {
    console.log(`Processing ${url}...`);

    // 访问目标URL
    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 60000,
    });

    if (response.status() === 200) {
      const content = await response.text();
      console.log("Response received successfully");
      console.log("Content:", content);
      // 在这里你可以进一步处理响应内容，比如解析 JSON 或保存到文件
    } else {
      console.error(`Request failed with status ${response.status()}`);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
}

// 使用示例
const targetUrl =
  "https://gmgn.ai/defi/quotation/v1/rank/eth/swaps/1h?orderby=smartmoney&direction=desc&filters[]=not_honeypot&filters[]=verified&filters[]=renounced";
crawl(targetUrl);
