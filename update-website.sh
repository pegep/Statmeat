#!/bin/sh

SCRIPT_DIR="$(dirname "$0")"
echo "Using dir $SCRIPT_DIR"
cd $SCRIPT_DIR

echo "Removing existing NeDB databases, *.nedb"

rm -f *.nedb

NODE_BIN=$HOME/.nvm/versions/node/$NODE_VER/bin/node
FIREBASE_BIN=/usr/local/bin/firebase

$NODE_BIN crawl.js
$NODE_BIN export-for-browser.js

DATE=`date +%Y-%m-%d:%H:%M:%S`

cp data.json public/
sed 's/sr-only//g' public/index.html.template > public/index.html
sed -i "s/{{last-updated}}/$DATE/g" public/index.html

echo "Deploying to Firebase..."
$NODE_BIN $FIREBASE_BIN deploy
