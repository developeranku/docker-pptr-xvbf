const puppeteer = require("puppeteer");
const http = require("http");

const takeScreenshot = async (browser, url) => {
  // Open a new page
  const page = await browser.newPage();

  // Navigate to the desired URL
  await page.goto(url);

  // Take a screenshot and save it
  await page.screenshot({
    path: "/usr/src/app/data/screenshot.png",
    fullPage: true,
  });

  console.log("Screenshot taken and saved as screenshot.png");

  // Close the browser
  await browser.close();
  return true;
};

http
  .createServer(async (req, res) => {
    if (req.method === "GET" && req.url.startsWith("/launch")) {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const queryParams = Object.fromEntries(url.searchParams);
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
      try {
        const ssUrl = queryParams?.url || "https://example.com";
        await takeScreenshot(browser, ssUrl);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Screenshot saved",
          })
        );
      } catch (err) {
        await browser.close();
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Error in saving screenshot",
          })
        );
      }
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Not found",
        })
      );
    }
  })
  .listen(8000, () => {
    console.log("Server running on http://localhost:8000");
  });
