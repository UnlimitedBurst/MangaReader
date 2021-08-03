# 根据[需求列表](/README.md)拟定一些技术解决方案

首先是漫画源选择了[mangabz](https://www.mangabz.com/)以及[xmanhua](https://xmanhua.com/)。

由于这两个网站的排行榜数据没有独立接口，所以只能是把包含排行榜的整个页面数据爬下来再解析排行榜数据，也就是访问首页响应的HTML Document。

这两个网站的HTML Dom结构不算复杂，所以使用正则表达式解析应该是较优解。参考[正则表达式引擎](https://deerchao.cn/tutorials/regex/diffs.html)，比较Java、JavaScript、Python这三者的标准库支持的正则表达式语法特性，差异不算太大，所以在应用开发初期，如果技术选型要在这些语言中来回摇摆，也能减少一定开发成本。

这里写了一段在bash环境下通过grep应用Perl正则表达式引擎解析[mangabz](https://www.mangabz.com/)排行榜的命令
```BASH
curl -s  https://www.mangabz.com/|grep -P '<p class="rank-item-title">.*?\/p>' -o|awk '{system("echo `echo '\''"$0"'\''|grep -P '\''(?<=href=\").*(?=\")'\'' -o`,`echo '\''"$0"'\''|grep -P '\''(?<=/\">).*(?=</a)'\'' -o`");}'
```
未完待续
