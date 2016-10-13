#!/bin/sh

source "$HOME/.nvm/nvm.sh"

echo "Removing existing NeDB databases, *.nedb"
cd "$(dirname "$0")"
rm -f *.nedb

$HOME/.nvm/versions/node/v5.0.0/bin/node crawl.js
$HOME/.nvm/versions/node/v5.0.0/bin/node export-for-browser.js

cp data.json public/

echo "Deploying to Firebase..."
firebase deploy
