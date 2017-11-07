# Statmeat
Meat in the Beat

Make Statbeat great again!

Statmeat-osoite päivitetty https://statmeat.com

# Tools and utilities
Install NodeJS.

Install Firebase tools, https://github.com/firebase/firebase-tools.

`npm install -g firebase-tools`

`npm install` to install project modules

# To crawl
`node crawl.js`

Crawls Statbeat and generates *NeDB* database files based on each JSON section in data.json and corresponding *data.json*.

# Export crawl.js's output for filtered public/data.json

Use `node export-for-browser.js` to produce *data.json* that is browser friendly and "minimized". The script requires that
crawl.js has been run and NeDB database section files are available.

# To deploy

```
cd Statmeat
firebase login
firebase deploy
```
