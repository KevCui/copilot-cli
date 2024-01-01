#!/usr/bin/env node

const { firefox } = require('playwright-firefox');
const fs = require('fs');

const cookieStr = fs.readFileSync('./cookies', 'utf8');
const searchText = process.argv[2];
const url = 'https://copilot.microsoft.com/';
const buttonQuestion = '.rai-button';
const buttonSubmit = '.submit';
const textMessage = '.content[tabindex="0"] .ac-textBlock';
const textareaSearchBox = '#searchbox';

firefox.launch({ headless: true, timeout: 50000 }).then(async browser => {
  const context = await browser.newContext();

  // Set cookies
  const cookies = cookieStr.split(';').map(cookie => {
    const [name, value] = cookie.trim().split('=');
    return { name, value, domain: 'copilot.microsoft.com', path: '/' };
  });
  await context.addCookies(cookies);

  // Start page
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  page.setDefaultTimeout(50000);

  // Submit question
  await page.fill(textareaSearchBox, searchText);
  await page.click(buttonSubmit);

  // Get reply
  await page.waitForSelector(buttonQuestion);
  const result = await page.locator(textMessage).textContent();
  console.log(result);

  // Delete chat
  await page.locator('.delete').first().click();
  await page.waitForTimeout(1000);

  // Close browser
  await context.close();
  await browser.close();
});
