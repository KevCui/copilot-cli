#!/usr/bin/env node

const { chromium } = require('playwright-chromium');

const searchText = process.argv[2];
const url = 'https://www.bing.com/chat';
const buttonExport = '#export-button';
const buttonSubmit = '.submit';
const textMessage = '.ac-container';
const textareaSearchBox = '#searchbox';

chromium.launch({ headless: true, timeout: 30000 }).then(async browser => {
  // Set page
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  await page.route("**/*", (route, request) => {
    if (request.resourceType() === "image"
      || request.resourceType() === "media") {
      route.abort();
    } else {
      route.continue();
    }
  });

  // Start page
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Submit question
  await page.fill(textareaSearchBox, searchText);
  await page.click(buttonSubmit);

  // Get reply
  await page.waitForSelector(buttonExport);
  const result = await page.locator(textMessage).textContent();
  console.log(result);

  // Close browser
  await browser.close();
});
