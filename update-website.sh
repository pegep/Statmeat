#!/bin/sh

. "$HOME/.nvm/nvm.sh"

echo "Removing existing NeDB databases, *.nedb"
cd "$(dirname "$0")"
rm -f *.nedb

$HOME/.nvm/versions/node/v5.0.0/bin/node crawl.js
$HOME/.nvm/versions/node/v5.0.0/bin/node export-for-browser.js

DATE=`date +%Y-%m-%d:%H:%M:%S`

cp data.json public/
sed 's/sr-only//g' public/index.html.template > public/index.html
sed -i "s/{{last-updated}}/$DATE/g" public/index.html

echo "Deploying to Firebase..."
$HOME/.nvm/versions/node/v5.0.0/bin/node /usr/local/bin/firebase deploy
