#!/bin/sh

source "$HOME/.nvm/nvm.sh"
nvm use node

echo "Removing existing NeDB databases, *.nedb"
cd "$(dirname "$0")"
rm -f *.nedb

node crawl.js
node export-for-browser.js

cp data.json public/

firebase deploy
