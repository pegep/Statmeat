#!/bin/sh

echo $(date)
echo

SCRIPT_DIR="$(dirname "$0")"
echo "Using dir $SCRIPT_DIR"
cd $SCRIPT_DIR

echo "Removing existing NeDB databases, *.nedb"

NODE_BIN=$(which node)
FIREBASE_BIN=$(which firebase)

echo "Using node $NODE_BIN"
echo "Using firebase $FIREBASE_BIN"

rm -f *.nedb

CRAWL_OUT=$(node crawl.js)
echo "$CRAWL_OUT"
echo

EXPORT_OUT=$(node export-for-browser.js)
echo "$EXPORT_OUT"
echo

DATE=`date +%Y-%m-%d:%H:%M:%S`

cp data.json public/
sed 's/sr-only//g' public/index.html.template > public/index.html
sed -i "s/{{last-updated}}/$DATE/g" public/index.html

echo "Deploying to Firebase..."
DEPLOY_OUT=$(firebase deploy)
echo "$DEPLOY_OUT"
