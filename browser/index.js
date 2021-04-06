const puppeteer = require("puppeteer");
const cherrio = require("cheerio");
async function startBrowser() {
  let browser;

  try {
    console.log("opening the browser.....");
    browser = await puppeteer.launch({
      headless: false,
      // excetuablePath:
      //   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
    const page = await browser.newPage();
    // console.log("type of page", page);
    await page.goto("https://www.linkedin.com");

    // await page.waitFor(3000);
    await page.click("#session_key");

    await page.keyboard.type("Enter_Email");
    await page.click('[id="session_password"]');

    await page.keyboard.type("Enter_Password");
    await page.click('[type="submit"]');
    await page.waitFor(3000);
    await page.goto(
      "https://www.linkedin.com/search/results/people/?currentCompany=%5B%221586%22%2C%2217411%22%2C%2212227%22%2C%2249318%22%2C%22167364%22%2C%2216551%22%2C%2214951%22%2C%222649984%22%2C%2246825%22%2C%22208137%22%2C%2234924%22%2C%2261712%22%2C%22451028%22%2C%2247157%22%2C%22111446%22%2C%2221433%22%2C%222382910%22%2C%2271099%22%2C%22860467%22%5D&geoUrn=%5B%22102095887%22%5D&origin=FACETED_SEARCH",
      {
        timeout: 0,
        waitUntil: "load",
      }
    );
    var names = await page.waitForSelector(".search-results-container");
    // console.log("this is names", names);
    const content = await page.content();
    await getNameData(content);
    // console.log("this is content", content);

    async function getNameData(html) {
      const $ = cherrio.load(html);

      $(".entity-result").each((i, element) => {
        const nameList = [];
        console.log("this is ", element);
        // console.log(
        $(element)
          .find("div.entity-result__content entity-result__divider ")
          .find("span.entity-result__title")
          .find("span.entity-result__title-line")
          .find("span.entity-result__title-text")
          .find("span.dir")
          .find("span")
          .each((i, element) => {
            // nameList.push($(element).text());
            console.log("this is element", element);
          });
        // );
      });
    }
  } catch (err) {
    console.log("Could not create a browser instance => :", err);
  }
  return browser;
}

module.exports = {
  startBrowser,
};
