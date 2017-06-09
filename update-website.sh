#!/bin/sh

. "$HOME/.nvm/nvm.sh"

echo "Removing existing NeDB databases, *.nedb"
cd "$(dirname "$0")"
rm -f *.nedb

. ~/.nvm/nvm.sh
nvm use node

NODE_VER=$(nvm current)
FIREBASE_BIN=$(which firebase)

$HOME/.nvm/versions/node/$NODE_VER/bin/node crawl.js
$HOME/.nvm/versions/node/$NODE_VER/bin/node export-for-browser.js

DATE=`date +%Y-%m-%d:%H:%M:%S`

cp data.json public/
sed 's/sr-only//g' public/index.html.template > public/index.html
sed -i "s/{{last-updated}}/$DATE/g" public/index.html

echo "Deploying to Firebase..."
$HOME/.nvm/versions/node/$NODE_VER/bin/node $FIREBASE_BIN deploy
