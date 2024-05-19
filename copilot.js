#!/usr/bin/env node

const { chromium } = require('playwright-chromium');

const searchText = process.argv[2];
const url = 'https://copilot.microsoft.com';
const buttonSubmit = '.submit';
const buttonReject = '.bnp_btn_reject';
const buttonStop = '#stop-responding-button';
const textMessage = '.ac-container';
const textareaSearchBox = '#searchbox';
const totalLoopCount = 60;
const printIntervalTime = 500;

chromium.launch({ headless: true, timeout: 30000 }).then(async browser => {
  // Set page
  const page = await browser.newPage();
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

  // Reject cookie
  await page.click(buttonReject);

  // Submit question
  await page.fill(textareaSearchBox, searchText);
  await page.click(buttonSubmit);

  // Get reply
  for (let i = 0; i < totalLoopCount; i++) {
    await new Promise((resolve) => setTimeout(resolve, printIntervalTime));
    const result = await page.locator(textMessage).textContent();
    console.clear();
    console.log('----------\n' + result.replace(/^\s*\n+/gm, '\n'));
    if (await page.locator(buttonStop).isDisabled()
      && i != (totalLoopCount - 1)){
      i = (totalLoopCount - 1);
    }
  }

  // Close browser
  await browser.close();
});
