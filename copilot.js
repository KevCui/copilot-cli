#!/usr/bin/env node

const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);

const searchText = process.argv[2];
const url = 'https://copilot.microsoft.com/';
const buttonExport = '#export-button';
const buttonSubmit = '.submit';
const buttonReject = '.bnp_btn_reject';
const textMessage = '.ac-container';
const textareaSearchBox = '#searchbox';

chromium.launch({ headless: true, timeout: 50000 }).then(async browser => {
  // Start page
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  page.setDefaultTimeout(50000);

  // Reject cookie
  await page.click(buttonReject);

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
