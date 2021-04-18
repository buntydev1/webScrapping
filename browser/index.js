const puppeteer = require("puppeteer");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const converToCSV = (employees) => {
  const array = [Object.keys(employees[0])].concat(employees);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join("\n");
};

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

    await page.keyboard.type("");
    await page.click('[id="session_password"]');

    await page.keyboard.type("3");
    await page.click('[type="submit"]');

    await page.waitFor(3000);

    // await page.goto(
    //   "https://www.linkedin.com/search/results/people/?currentCompany=%5B%221586%22%2C%2217411%22%2C%2212227%22%2C%2249318%22%2C%22167364%22%2C%2216551%22%2C%2214951%22%2C%222649984%22%2C%2246825%22%2C%22208137%22%2C%2234924%22%2C%2261712%22%2C%22451028%22%2C%2247157%22%2C%22111446%22%2C%2221433%22%2C%222382910%22%2C%2271099%22%2C%22860467%22%5D&geoUrn=%5B%22102095887%22%5D&origin=FACETED_SEARCH&page=17",
    //   {
    //     timeout: 0,
    //     waitUntil: "load",
    //   }
    // );
    const urls = [
      "https://www.linkedin.com/search/results/people/?currentCompany=%5B%221586%22%2C%2217411%22%2C%2212227%22%2C%2249318%22%2C%22167364%22%2C%2216551%22%2C%2214951%22%2C%222649984%22%2C%2246825%22%2C%22208137%22%2C%2234924%22%2C%2261712%22%2C%22451028%22%2C%2247157%22%2C%22111446%22%2C%2221433%22%2C%222382910%22%2C%2271099%22%2C%22860467%22%5D&geoUrn=%5B%22102095887%22%5D&origin=FACETED_SEARCH",
    ];

    for (i = 2; i <= 3; i++) {
      urls.push(
        `https://www.linkedin.com/search/results/people/?currentCompany=%5B%221586%22%2C%2217411%22%2C%2212227%22%2C%2249318%22%2C%22167364%22%2C%2216551%22%2C%2214951%22%2C%222649984%22%2C%2246825%22%2C%22208137%22%2C%2234924%22%2C%2261712%22%2C%22451028%22%2C%2247157%22%2C%22111446%22%2C%2221433%22%2C%222382910%22%2C%2271099%22%2C%22860467%22%5D&geoUrn=%5B%22102095887%22%5D&origin=FACETED_SEARCH&page=${i}`
      );
      console.log("this is i", i);
    }

    for (i = 0; i < urls.length; i++) {
      const url = urls[i];
      await page.goto(url);

      await page.waitForSelector("ul.reusable-search__entity-results-list");

      const allData = await page.$$eval(
        "li.reusable-search__result-container",
        (options) =>
          options.map((option) => {
            return (obj = {
              name: option
                .querySelector(".entity-result__title-text > a ")
                .innerText.trim(),
              profileURL: option.querySelector(
                "div.entity-result__content > div > div > div> span > div > span > span > a"
              ).href,
              designation: option.querySelector(
                ".entity-result__item > div.entity-result__content > div > div > div:nth-child(2) > div.entity-result__primary-subtitle"
              ).innerText,
              location: option.querySelector(
                ".entity-result__item > div.entity-result__content > div > div >  div:nth-child(2) > div.entity-result__secondary-subtitle"
              ).innerText,
            });
          })
      );

      console.log("this is option", allData);

      // const csvWriter = createCsvWriter({
      //   path: "out.csv",
      //   header: [
      //     { id: "name", title: "Name" },
      //     { id: "profileURL", title: "profileURL" },
      //     { id: "designation", title: "Designation" },
      //     { id: "location", title: "Location" },
      //   ],
      // });
      // csvWriter
      //   .writeRecords(allData)
      //   .then(() => console.log("The CSV file was written successfully"));

      const csv = converToCSV(allData);
      console.log("🚀 ~ file: index.js ~ line 100 ~ startBrowser ~ csv", csv);

      fs.appendFile("out.csv", csv, (err) => {
        if (err) console.error("Couldn't append the data");
        console.log("The data was appended to file!");
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
