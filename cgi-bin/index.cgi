#!/bin/ash
echo "Content-Type:text/html"
echo ""
echo "<script src="/static/index.js?s=$(date +%s)"></script>"
echo "<link rel="stylesheet" type="text/css" href="/static/index.css?s=$(date +%s)">"
curl -s https://www.mangabz.com/ | grep -P '<div class="rank-list(.*?\/div>){10}' -o | grep -P '<p class="rank-item-title">(.*?\/p>){2}' -o | sed 's/a href="/a href="https:\/\/www.mangabz.com/g'
