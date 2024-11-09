#!/usr/bin/env node

const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);

const searchText = process.argv[2];
const url = 'https://copilot.microsoft.com';
const buttonStart = '[title="Get started"]';
const buttonNext = '[title="Next"]';
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
  try {
    await page.locator(buttonStart).waitFor({ timeout: 1000})
    await page.click(buttonStart);
  } catch (e) {}

  // Fill first name
  try { 
    await page.locator(textFirstName).waitFor({ timeout: 1000})
    await page.fill(textFirstName, 'x');
    await page.click(buttonSubmit);
  } catch (e) {}

  // Click "Next" button
  try { 
    await page.locator(buttonNext).waitFor({ timeout: 1000})
    await page.click(buttonNext);
  } catch (e) {}

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
