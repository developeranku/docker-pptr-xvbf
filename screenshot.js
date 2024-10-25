const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  // Launch Puppeteer with Xvfb display
  const browser = await puppeteer.launch({
    headless: false, // Set to false to see the browser in action
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-infobars",
      "--window-size=1280,800",
    ],
    executablePath: "/usr/bin/google-chrome",
  });

  // Open a new page
  const page = await browser.newPage();

  // Navigate to the desired URL
  await page.goto("https://example.com");

  // Take a screenshot and save it
  await page.screenshot({
    path: path.join(__dirname, "screenshot.png"),
    fullPage: true,
  });

  console.log("Screenshot taken and saved as screenshot.png");

  // Close the browser
  await browser.close();
})();
