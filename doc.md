# 根据[需求列表](/README.md)拟定一些技术解决方案

首先是漫画源选择了[mangabz](https://www.mangabz.com/)以及[xmanhua](https://xmanhua.com/)。

## 技术选型
由于这两个网站的排行榜数据没有独立接口，所以只能是把包含排行榜的整个页面数据爬下来再解析排行榜数据，也就是访问排行榜页面响应的HTML Document。又因为两个网站的HTML Dom结构不算复杂，所以直接使用shell应用Perl正则表达式解析HTMl Dom。

综上所述我选择**nginx**+**fcgiwrap**+**shell** 实现以下几个功能。  
## 测试环境
### docker alpine

## 展示[mangabz](https://www.mangabz.com/)漫画排行榜
![排行榜数据](/rank.png)  
先匹配**class=rank-list**这块节点，再匹配每块子节点的漫画名称，链接，类型信息，详看代码逻辑[/cgi-bin/index.cgi](/cgi-bin/index.cgi)。

## 实现漫画订阅功能
订阅漫画时，把漫画相对链接以及名称写入一个文件里，取消订阅则删除该行数据。如下所示：
```
/38bz,一拳超人
/64bz,炎炎之消防隊
```
订阅逻辑：[/cgi-bin/sub.cgi](/cgi-bin/sub.cgi)、取消订阅逻辑：[/cgi-bin/cancel.cgi](/cgi-bin/cancel.cgi)
## 检测订阅漫画最新章节
![检测漫画最新章节](/checkUpdate.png)  
每部漫画章节列表页面，默认是倒序排列，所以直接匹配第一行第一列章节就是最新章节。  

* 漫画链接**不存在**最新章节文件里，直接把漫画链接、漫画章节链接、章节名写入到文件行。
* 漫画链接**存在**最新章节文件里，漫画章节链接和文件行里的漫画章节链接**不匹配**，则有新章节更新，进行消息推送。
* 漫画链接**存在**最新章节文件里，漫画章节链接和文件行里的漫画章节链接**匹配**，没有漫画章节更新。  
最新章节记录文件结构如下：
```
/64bz,/m217708,第304話試看版（22P）
```
代码逻辑：[/cron/checkUpdate](/cron/checkUpdate)

## 爬取[mangabz](https://www.mangabz.com/)漫画章节图片

分析[加载漫画章节图片地址接口](https://www.mangabz.com/m245810/chapterimage.ashx?cid=245810&page=1&key=&_cid=245810&_mid=134&_dt=2022-09-27+22%3A19%3A04&_sign=1b7df580e408d16f431855133f5598b5)

```JavaScript
    ajaxobject = $.ajax({
        url: 'chapterimage.ashx',
        data: { cid: MANGABZ_CID, page: MANGABZ_PAGE, key: mkey, _cid: MANGABZ_CID, _mid: MANGABZ_MID, _dt: MANGABZ_VIEWSIGN_DT, _sign: MANGABZ_VIEWSIGN },
        type: 'GET',
        error: function (msg) {
        },
```

其中接口参数从漫画页https://www.mangabz.com/m245810/ 一段js脚本定义的全局变量获取</br>
```JavaScript
<script type="text/javascript">
    var isVip = "False";
    var MANGABZ_COOKIEDOMAIN = 'mangabz.com';
    var COMIC_MID = 134;
    var MANGABZ_CURL = "/m245810/";
    var MANGABZ_CURL_END = "/m245810-end/";
    var MANGABZ_CTITLE = "不過是蜘蛛什么的 外傳：第89話 ";
    var MANGABZ_MID = 134;
    var MANGABZ_CID = 245810;
    var MANGABZ_IMAGE_COUNT = 10;
    var MANGABZ_USERID = 0;
    var MANGABZ_FROM = "%2fm245810%2f";
    var MANGABZ_PAGETYPE = 9;
    var MANGABZ_PAGEINDEX = 1;
    var MANGABZ_PAGEPCOUNT = 1;
    var MANGABZ_POSTCOUNT = 0;
    var MANGABZ_LOADIMAGEURL = 'https://css.mangabz.com/v202207231947/mangabz/images/loading.gif';
    var MANGABZ_LOADIMAGEURLW = 'https://css.mangabz.com/mangabz/images/newloading2.gif';
    var MANGABZ_LOADIMAGEURLWH = 'https://css.mangabz.com/mangabz/images/newloading3.gif';
    var MANGABZ_LOADINGIMAGE = 'https://css.mangabz.com/v202207231947/mangabz/images/loading.gif';
    var MANGABZ_READMODEL = 1;
    var MANGABZ_CURRENTFOCUS = 1;
    var MANGABZ_VIEWSIGN = "1b7df580e408d16f431855133f5598b5";
    var MANGABZ_VIEWSIGN_DT = "2022-09-27 22:19:04";
    reseturl(window.location.href, MANGABZ_CURL.substring(0, MANGABZ_CURL.length - 1));
</script>
```
这个接口会返回一段自执行函数
```javascript
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('e 9(){2 6=4;2 5=\'a\';2 7="g://j.h.f/1/b/4";2 3=["/c.8","/k.8"];o(2 i=0;i<3.l;i++){3[i]=7+3[i]+\'?6=4&5=a&m=\'}n 3}2 d;d=9();',25,25,'||var|pvalue|245810|key|cid|pix|jpg|dm5imagefun|5e3a80bac425a436e0d545c213a78c0a|134|1_6124||function|com|https|mangabz||image|2_7345|length|uk|return|for'.split('|'),0,{}))
```
执行上述函数就会返回一个包含若干页漫画图片地址的数组
```javascript
[
  'https://image.mangabz.com/1/134/245810/1_6124.jpg?cid=245810&key=5e3a80bac425a436e0d545c213a78c0a&uk=',
  'https://image.mangabz.com/1/134/245810/2_7345.jpg?cid=245810&key=5e3a80bac425a436e0d545c213a78c0a&uk='
]
```
因为服务端基于shell编写，所以我想通过调用在线执行javascript代码接口来获取漫画图片地址。  
目前找到[JavaScript在线运行](https://www.bejson.com/runcode/javascript/)网站，抓包发现可以简单调用以下两个接口实现上述需求。
* [创建解析JS代码任务](https://runcode.bejson.com/try_run?action=get_token)
* [查询JS代码输出结果](https://runcode.bejson.com/try_run?action=get_result&token=911e6bed-fe81-48d4-b01c-476fcb178d42)

创建任务会获取一个token，供查询接口使用。输出结果是base64编码，需要做解码操作。  
原网站逻辑：
```JavaScript
   $.get("//runcode.bejson.com/try_run?action=get_result&token="+token,function (data) {
        if(typeof data.status !="undefined" && typeof data.status.description !="undefined" && data.status.description=='Accepted')
        {
            var html="";
            if (data.stderr!=null)
                html+="<div><b>标准错误：</b></div><pre>"+(Base64.decode(data.stderr)+"")+"</pre>";
            if (data.stdout!=null)
                html+="<div><b>标准输出：</b></div><pre>"+(Base64.decode(data.stdout)+"")+"</pre>";
            output_result(html);
            $('#runCode').button('reset')
        }
```  
解析图片地址后下载到本地目录，目录名按漫画id/章节id 命名，比如/134/245810。
上述逻辑详看：[/cron/loadImage](/cron/loadImage)

## 定时任务

## 通知订阅更新
## 参考
* [正则表达式引擎](https://deerchao.cn/tutorials/regex/diffs.html)

未完待续
