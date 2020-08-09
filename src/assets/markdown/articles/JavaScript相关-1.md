---
title: JavaScript相关-1
date: 2020-02-11 23:33:22
tags: JavaScript
categories: JavaScript
---

## document.write

`document.write()` 方法将一个文本字符串写入一个由 [`document.open()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/open) 打开的文档流（document stream）。（[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/write)）

作用：

加载只有启用JavaScript后的样式文件

``` html
<script>
    document.open()
    docuemnt.write('<link rel="stylesheet" href="style_neads_js.css" />')
    document.close()
</script>
```

弊端：

- 在非loading阶段使用`docuemnt.write`会清除已加载的页面
- `docuemnt.write`不能够在XHTML中使用
- 嵌入script中的`docuemnt.write`不能给任意节点添加子节点，因为它是随着DOM的构建执行的
- 利用`docuemnt.write`写入HTML字符流并不是一个好方法，它有违DOM操作的概念
- 利用`docuemnt.write`添加script加载外部脚本时，浏览器的HTML解析会被script的加载所阻塞

## 功能检测（feature detection）、功能推断（feature inference）、和使用UA字符串之间有什么区别

功能检测（feature detection） 👍

功能检测包括确定浏览器是否支持某段代码，以及是否能运行不同的代码（取决于它是否执行），一边浏览器能始终正确运行代码功能，而不会在某些浏览器中出现崩溃和错误

``` javascript
if ("geolocation" in navigator) {
    // 可以使用 navigator.geolocation
} else {
    // 处理 navigator.geolocation 功能缺失
}
```

功能推断（feature inference）👎

功能推断与功能检测一样，会对功能可用性进行检查，但是在判断通过后还会使用其他功能，因为它假设其他功能也可用

```javascript
if (document.getElementsByTagName) {
  element = document.getElementById(id);
}
```

UA 👎

这是一个浏览器报告的字符串，它允许网络协议对等方（network protocol peers）识别请求用户代理的应用类型、操作系统、应用供应商和应用版本。它可以通过`navigator.userAgent`访问。然而，这个字符串很可能存在欺骗性，例如，chrome会同时作为chrome和safari进行报告，因此，要检测safari，除了检查safari字符串，还要检查是否同时存在chrome字符串。

## Ajax

**WHAT**

Ajax（asynchronous JavaScript and XML）是使用客户端上的许多web技术，创建异步web应用的一种**技术结合体**。借助Ajax，web应用可以**异步**（在后台）向服务器发送数据可从服务器检索数据而不会干扰现有页面的显示和行为。通过将**数据交互层与表示层分离**，Ajax允许网页和扩展web应用程序动态更改内容而**不需重新加载整个页面**，实际上，现在通常将XML替换为JSON，因为JavaScript对JSON有原生支持优势

**WHY**

优点：

- 交互性更好，来自服务器的新内容可以动态更改，无需重新加载整个页面
- 减少与服务器的连接，因为脚本和样式只需要被请求一次
- 状态可以维护在一个页面上，JavaScript变量和DOM状态将的到保持，因为主容器页面未被重新加载
- 基本上包含大部分SPA的优点

缺点

- 动态网页很难收藏
- 如果JavaScript在浏览器中被禁用则不起作用
- 有些网络爬虫不执行JavaScript，也不会看到JavaScript加载的内容

**HOW**

- 使用`CSS`和`XHTML`来表示
- 使用`DOM`模型来交互和动态显示
- 使用`XMLHttpRequest`来和服务器进行异步通信
- 使用`JavaScript `来绑定和调用

``` javascript
var ajax = {};
ajax.httpRequest = function () {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];
    let xhr;
    for (let i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};

ajax.send = function (url, callback, method, data, async) {
    if (async === undefined) {
        async = true;
    }
    let httpRequest = ajax.httpRequest();
    httpRequest.open(method, url, async);
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4) {
            callback(httpRequest.responseText)
        }
    };
    if (method == 'POST') {
        httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    httpRequest.send(data);
};

ajax.get = function (url, data, callback, async) {
    let query = [];
    for (let key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

ajax.post = function (url, data, callback, async) {
    let query = [];
    for (let key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url, callback, 'POST', query.join('&'), async)
};
```

## JSONP

**WHAT**

带填充的json（p for padding），是一种通常用于绕过浏览器中的跨域选址的方法，因为Ajax不允许跨域请求。

原理：利用 `<script>` 标签没有跨域限制的漏洞。通过 `<script>` 标签指向一个需要访问的地址并提供一个回调函数来接收数据。

**WHY**

解决跨域（只适用于GET请求）

**HOW**

``` javascript
// jsonp.js
function jsonp({ url, params, cb }) {
    return new Promise((resolve, reject) => {
        let script = document.createElement("script")
        window[cb] = data => {
            resolve(data)
            document.body.removeChild(script)
        }
        params = { ...params, cb }
        let tmp = []
        for(let key in params)
            tmp.push(`${ key }=${ params[key] }`)
        script.src = `${ url }?${ tmp.join("&") }`
    })
}

jsonp({ 
    url: "http://localhost:3000/say",
    params: { wd: "hello jsonp" },
    cb: "show"
}).then(data => {
    console.log(data);
})

// server.js
let express = require("express")
let app = express()
app.get("/say", (res, res) => {
    let { wd, cb } = req.query
    res.end(`${cb}('i am fine, and you?')`)
})
app.listen(3000)
```

## 变量提升

变量提升（hoisting）用于解释代码中变量声明行为的术语。使用`var`关键字声明或初始化的变量会将声明语句“提升”到当前作用域的顶部。但是只有声明才会触发提升，赋值语句将保持原样。

``` javascript
console.log(foo) // undefined
var foo = 1
console.log(foo) // 1

console.log(foo) // ReferenceError: bar is not defined
let foo = 1
console.log(foo) // 1
```

函数声明会使函数体提升，但函数表达式（以声明变量的形式书写）只有变量声明会提升

``` javascript
// 函数声明
console.log(foo)
foo(); // 'foo'
function foo() {
    console.log('foo')
}
console.log(foo); // [Function: foo]

// 函数表达式
console.log(bar) // undefined
bar(); // Uncaught TypeError: bar is not a function
var bar = function () {
    console.log('bar')
}
console.log(bar) // [Function: bar]
```

## 事件冒泡

当一个事件在DOM元素上触发时，如果有时间监听器，它尝试处理该事件，然后事件冒泡到其父级元素，并发生同样的事情，最后直至到达祖先元素。时间冒泡机制是实现事件委托（event delegation）的原理

## attribute和property

attribute是在HTML中定义的，而property实在DOM上定义的。

``` html
<input id="input1" type="text" value="hello" />

<script>
	const input = document.getElementById("input1")
    console.log(input.getAttribute("value")) // hello
    console.log(input.value) // hello
    
    // 当在文本框中输入 ‘world’ 后
    console.log(input.getAttribute("value")) // hello
    console.log(input.value) // world
</script>
```

## document的load事件和DOMContentLoaded事件之间的区别

DOMContentLoaded：👍

当初始的HTML文档本完全加载和解析完成之后，DOMContentLoaded事件被触发而无需等待样式表、图像和子框架的完成加载

load：

window的load事件仅在DOM和所有相关资源全部完成加载后才会触发

``` javascript
document.addEventListener("DOMContentLoaded", event => {
    console.log("DOMContentLoaded");
})
window.addEventListener("load", () => {
    console.log("window loaded");
})

// DOMContentLoaded
// window loaded
```



## 同源策略

同源策略是由Netscape提出的一个著名的安全策略，浏览器出于安全方面的考虑，只允许本域名下的接口交互，不同源的客户端脚本，在没有明确授权的情况下，不能读取对方的资源。

[同源的定义:](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)

如果两个页面的协议，端口（如果有指定）和主机都相同，则两个页面具有相同的**源**。我们也可以把它称为“协议/主机/端口 tuple”，或简单地叫做“tuple". ("tuple" ，“元”，是指一些事物组合在一起形成一个整体，比如（1，2）叫二元，（1，2，3）叫三元)

下表给出了相对`http://store.company.com/dir/page.html`同源检测的示例:

| URL                                               | 结果 | 原因         |
| ------------------------------------------------- | ---- | ------------ |
| `http://store.company.com/dir2/other.html`        | 成功 | 只有路径不同 |
| `http://store.company.com/dir/inner/another.html` | 成功 | 只有路径不同 |
| `https://store.company.com/secure.html`           | 失败 | 协议不同     |
| `http://store.company.com:81/dir/etc.html`        | 失败 | 端口不同     |
| `http://news.company.com/dir/other.html`          | 失败 | 域名不同     |

## JavaScript严格模式

**WHAT**

ES5最早引入了“严格模式”（strict mode）的概念。可选择的一个限制JavaScript的变体的一种方式

**WHY**

优点：

- 无法再意外创建全局变量
- 会引起静默失败（sliently fail， 即：不报错也没有任何效果）的操作抛出异常
  - 对变量调用`delete`操作符
  - 为只读属性赋值
  - 对不可配置（nonconfigurable）的属性使用`delete`操作符
- 试图删除不可删除的属性时会抛出异常
- 要求函数的参数名唯一
- 某些保留字（`interface`、`implements`、`package`等）不能作为变量名
- 抑制`this`
  - 全局作用域下，`this`的值为`undefined`
  - `.call()`、`.apply()`传递错误的`this`会报错（非严格模式下会转换为全部对象）
- 捕获了一些常见的编码错误，并抛出异常

缺点：

- 确实许多开发人员已经习惯的功能
- 无法访问`function.caller`和`function.arguments`
- 以不同严格模式编写的脚本合并后可能会导致问题

**HOW**

在需要启用严格模式的**代码**顶部添加：`"use strict;"`

## SPA

**WHAT**

single page application 单页面应用

现如今，web程序员将他们构建的产品成为web应用而不是网站。虽然这两个术语之间没有严格的区别，但网络应用往往具有高度的交互性和动态性，允许用户执行操作并接受他们的操作响应。在过去，浏览器从服务器接收HTML并渲染，当用户导航到其他URL时，需要整页刷新，服务器会为新页面发送新的HTML，这被称为服务端渲染

然而，在现代的SPA中，客户端渲染取而代之。浏览器从都武器加载**初始页面**，整个应用程序所所需的脚本（库、框架、应用代码）和样式表。当用户导航到其他页面时，**不会触发页面刷新**，该页面的URL通过[HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)进行更新。浏览器通过Ajax请求向服务器检索所需的数据（通常采用json格式），然后SPA**通过JavaScript来动态更新页面**，这些JavaScript在初始页面已经下载。这种模式类似于原生移动应用的工作方式。

![SPA](./imgs/spa.png)

**WHY**

好处：

- 用户感知响应更快，用户切换页面时不会再看到因页面刷新而导致的白屏
- 对服务器进行的HTTP请求减少，因为对于没和页面的加载不必再次下载相同的资源
- 客户端和服务端之间的关注点分离，可以为不同平台（手机、智能手表）建立新的客户端而不需修改服务器代码。

弊端：

- 由于加载了多个页面需要的框架、应用代码和资源导致初始页面加载时间过长
- 服务器还需额外的工作将是所有路由请求配置到单个入口点，然后由客户端接管路由
- SPA依赖于JavaScript来渲染页面，对SEO不友好

**HOW**

1. 向服务器请求初始页面并渲染，同时请求整个应用所需的脚本、样式
2. 监听用户操作：
   - 通过[HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)进行页面导航
   - 通过Ajax向服务器请求数据并使用JavaScript动态渲染到页面上