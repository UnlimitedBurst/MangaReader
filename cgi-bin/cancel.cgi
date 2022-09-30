#!/bin/ash
file=/var/www/static/sub.db
. /root/bashlib-0.4/bashlib
echo "Content-Type:text/plain"
echo ""
href=`param href`
#echo $href
sed -i /\\$href/d $file
echo '取消订阅成功'
