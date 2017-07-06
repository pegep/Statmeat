#!/bin/sh

SCRIPT_DIR="$(dirname "$0")"
echo "Using dir $SCRIPT_DIR"
cd $SCRIPT_DIR

# add firebase and node binaries to path
export PATH=$PATH:/usr/local/bin:$HOME/.nvm/versions/node/v8.0.0/bin/node

echo "Removing existing NeDB databases, *.nedb"

rm -f *.nedb

$NODE_BIN crawl.js
$NODE_BIN export-for-browser.js

DATE=`date +%Y-%m-%d:%H:%M:%S`

cp data.json public/
sed 's/sr-only//g' public/index.html.template > public/index.html
sed -i "s/{{last-updated}}/$DATE/g" public/index.html

echo "Deploying to Firebase..."
firebase deploy
