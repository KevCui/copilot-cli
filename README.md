# copilot-cli

> Chat with [Microsoft Copilot](https://copilot.microsoft.com/) in terminal

# Table of Contents

- [Dependency](#dependency)
- [Installation](#installation)
- [Create cookies file](#create-cookies-file)
- [How to use](#how-to-use)
- [Note](#note)

## Dependency

- [playwright-firefox](https://github.com/Microsoft/playwright)

## Installation

```bash
npm i playwright-firefox
npx playwright install firefox
```

## Create cookies file

- Open browser DevTools and sign in `https://copilot.microsoft.com/`
- Get cookie string from `cookie` header in any request
- Save it in the file called `./cookies`
- When cookies gets expired, repeat above steps to save new string into the same file

## How to use

```bash
$ ./copilot.js "enter any text here"
```

## Note

This script is designed to handle only one question and one answer at a time. The answer is in plain text format. It is designed for command line usage to get quick answer in terminal, not for a nice looking conversation with Microsoft Copilot.

---

<a href="https://www.buymeacoffee.com/kevcui" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-orange.png" alt="Buy Me A Coffee" height="60px" width="217px"></a>
