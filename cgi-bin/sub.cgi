#!/bin/ash
file=/var/www/static/sub.db
. /root/bashlib-0.4/bashlib
echo "Content-Type:text/html"
echo ""
echo `param href`,`param name` >> $file
echo '订阅成功'
