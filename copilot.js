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
    await page.locator(buttonStart).waitFor({ timeout: 2500})
    await page.click(buttonStart);
  } catch (e) {}

  // Fill first name
  try { 
    await page.locator(textFirstName).waitFor({ timeout: 800})
    await page.fill(textFirstName, 'x');
    await page.click(buttonSubmit);
  } catch (e) {}

  // Click "Next" button
  try { 
    await page.locator(buttonNext).waitFor({ timeout: 800})
    await page.click(buttonNext);
  } catch (e) {}

  // Submit question
  await page.fill(textareaSearchBox, searchText);
  await page.click(buttonSubmit);

  // Get reply
  var prevResult = '';
  for (let i = 0; i < totalLoopCount; i++) {
    await new Promise((resolve) => setTimeout(resolve, printIntervalTime));
    const elems = await page.locator(textMessage)
    const count = await elems.count();
    var result = '';
    for (let j = 0; j < count; j++) {
      result += await elems.nth(j).innerHTML();
    }
    // remove buttons
    result = result.replace(/<button .*?>.*?<\/button>/g, "");
    // convert <p> to newline
    result = result.replace(/<p>(.*?)<\/p>/g, '\n$1\n');
    // remove remaining HTML tags
    result = result.replace(/<\/?[^>]+(>|$)/g, "");

    console.clear();
    console.log('----------\n' + result);

    if (prevResult != '' && prevResult == result && i != (totalLoopCount - 1)) {
      i = (totalLoopCount - 1);
    }
    prevResult = result
  }

  // Close browser
  await browser.close();
});
