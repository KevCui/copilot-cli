#!/usr/bin/env node

const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);

const searchText = process.argv[2];
const url = 'https://copilot.microsoft.com';
const buttonStart = '[title="Get started"]';
const buttonSkip = '[title="Skip"]';
const buttonSubmit = '[title="Submit message"]';
const textFirstName = '[placeholder="Your first name"]';
const textMessage = '[data-content="ai-message"] div';
const textareaSearchBox = '#userInput';
const totalLoopCount = 60;
const printIntervalTime = 800;

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

  // Click "Get start" button
  await page.click(buttonStart);

  // Fill first name
  await page.fill(textFirstName, 'x');
  await page.click(buttonSubmit);

  // Click "Skip" button
  await page.click(buttonSkip);

  // Submit question
  await page.fill(textareaSearchBox, searchText);
  await page.click(buttonSubmit);

  // Get reply
  var prevResult = '';
  for (let i = 0; i < totalLoopCount; i++) {
    await new Promise((resolve) => setTimeout(resolve, printIntervalTime));
    const result = await page.locator(textMessage).first().innerText();
    console.clear();
    console.log('----------\n' + result.replace(/^\s*\n+/gm, '\n'));
    if (prevResult == result && i != (totalLoopCount - 1)) {
      i = (totalLoopCount - 1);
    }
    prevResult = result
  }

  // Close browser
  await browser.close();
});
