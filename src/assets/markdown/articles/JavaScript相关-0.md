---
title: JavaScript相关-0
date: 2020-02-10 23:18:10
tags: JavaScript
categories: JavaScript
---

## 事件委托 （event delegation）
事件委托是将事件监听器添加到父元素，而不是每个子元素单独设置事件监听器，当触发子元素时，事件会冒泡到父元素，监听器就会触发，这种技术的好处是：

1. 内存占用少，因为只需要一个父元素的事件处理程序，而不必为每个后代都添加事件处理程序。
2. 无需从已删除的元素中解绑处理程序，也无需将处理程序绑定到新元素上。

## JavaScript中的this指向
简单来讲，`this`的指向取决于函数的调用方式

0. 如果是箭头函数，`this`被设置为调用时的上下文
1. 如果使用`new`，函数内的`this`是一个全新的对象
2. 如果`apply、call、bind`方法用于调用/创建一个函数，函数内的`this`就是作为参数传入这些方法的对象
3. 当函数作为对象里的方法被调用时，函数内的`this`是调用该函数的对象，比如当`obj.method()`被调用时，函数内的`this`将绑定到`obj`对象
4. 如果不符合上述规则，那么`this`的值指向全局对象`global object`，浏览器环境下`this`的值指向`window`对象，但在严格模式下`use strict`，`this`的值为`undefined`
5. 如果符合上述多个规则，从上到下权重依次递减

## 原型继承 `prototypal inheritance`
所有的JS对象都有一个`prototype`对象，指向它的原型对象，当试图访问一个对象的属性时，如果没有在该对象上找到它还会搜索该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或达到原型链的末尾。这种行为是在模拟经典的继承，但与其说时继承还不如说是委托`delegation`

读取对象的属性值时，会自动到原型链中查找

设置对象的属性值时，不会查找原型链，如果当前对象中没有此属性，直接添加此属性并设置其值

![原型](./imgs/1581317824537.png)

## JavaScript的模块化机制

- AMD

  **Asynchronous Module Definition 异步模块加载机制**，ReqireJS实现了AMD规范

  ```javascript
  //a.js
  //define可以传入三个参数，分别是字符串-模块名、数组-依赖模块、函数-回调函数
  define(function(){
      return 1;
  })
  
  // b.js
  //数组中声明需要加载的模块，可以是模块名、js文件路径
  require(['a'], function(a){
      console.log(a);// 1
  });
  ```

  特点：

  对于依赖的模块，AMD推崇**依赖前置，提前执行**，也就是说，在`define`方法里传入的依赖模块（数组）会在一开始就下载并执行。适合在**浏览器端**使用

- CommonJS

  CommonJS规范为CommonJS小组所提出，目的是弥补JavaScript在服务器端缺少模块化机制，**NodeJS、webpack**都是基于该规范来实现的。

  ``` javascript
  //a.js
  module.exports = function () {
    console.log("hello world")
  }
  
  //b.js
  var a = require('./a');
  
  a();//"hello world"
  
  //或者
  
  //a2.js
  exports.num = 1;
  exports.obj = {xx: 2};
  
  //b2.js
  var a2 = require('./a2');
  
  console.log(a2);//{ num: 1, obj: { xx: 2 } }
  ```

  特点：

  - 所有代码都运行在**模块作用域**，不会污染全局作用域
  - 模块是**同步加载**的，即只有加载完成才能执行后面的操作
  - 模块在首次执行后就会**缓存**，再次加载只返回缓存结果，如果想要再次执行，可清除缓存
  - `require`返回的是被输出的**值的拷贝**，模块内部的变化也不会影响这个值

- ES6 Module

  ES6 Module是**ES6**中规定的模块体系

  ``` javascript
  //a.js
  var name = 'lin';
  var age = 13;
  var job = 'ninja';
  
  export { name, age, job};
  
  //b.js
  import { name, age, job} from './a.js';
  
  console.log(name, age, job);// lin 13 ninja
  
  //或者
  
  //a2.js
  export default function () {
    console.log('default ');
  }
  
  //b2.js
  import customName from './a2.js';
  customName(); // 'default'
  ```

  特点（对比CommonJS）：

  |          | CommonJS     | ES6 Module     |
  | -------- | ------------ | -------------- |
  | 加载时间 | 运行时加载   | 编译时输出接口 |
  | 加载方式 | 加载整个模块 | 按需加载       |
  | 输出方式 | 值的拷贝     | 值的引用       |
  | this     | 指向当前模块 | undefined      |

## 闭包（closure）

- WHAT

  定义：

  1. 即使被外部函数返回，依然可以访问到外部（封闭）函数作用域的**函数**。

  2. 包含被引用变量（函数）的**对象**

  生命周期：

  ​	产生：在嵌套内部函数**定义执行完**时就产生了（**不是在调用**）

  ​	死亡：在嵌套内部函数成为垃圾对象时

- WHY

  - 可以实现数据私有化或特权方法

    ``` javascript
    function count () {
      let tmp = 0;
      return function () {
        return tmp++;
      }
    }
    
    let counter1 = count()
    console.log(counter1());
    console.log(counter1());
    console.log(counter1());
    console.log("---------");
    let counter2 = count()
    console.log(counter2());
    console.log(counter2());
    
    // 0
    // 1
    // 2
    // ----new counter-----
    // 0
    // 1
    ```

  - 实现单例模式

    ``` javascript
    // 单例模式
    class Single {
      test () {
        console.log("test")
      }
    }
    
    // ()()的作用：使函数立即调用一次
    // 闭包的作用：私有化变量
    Single.getIntance = (function () {
      let instance = null
      return function () {
        if(!instance) {
          instance = new Single()
        }
        return instance
      }
    })()
    ```

  - 部分参数函数（partial applications）柯里化（currying）

    函数式编程-柯里化

- HOW

  常见的创建闭包的方式是在一个函数内部创建另一个函数

  ``` javascript
  function test() {
    let a = 12
    return function () {
      console.log("test", a)
    }
  }
  ```

## `.foreach`和`.map`的区别
  - 都是用来遍历一个数组
  - `foreach`对原数组有副作用，而`map`则会返回一个新的数组

## 匿名函数的使用场景
- 在IIFE中使用,用来封装局部作用域内的代码，避免污染全局作用域
``` javascript
(function () {
  // do something
})()
```
- 可以作为回调函数，简洁易读
``` javascript
settimeout(function () {
  // do something
}, 1000)
```
- 用作函数式编程
``` javascript
const arr = [1, 2, 3]
arr.map(el => {
  console.log(el)
})
```

## 宿主对象（host objects）和原生对象（native objects）的区别
- 原生对象是由ECMAScript规范定义的JavaScript内置对象，如`String`、`Math`、`RegExp`等
- 宿主对象是指由运行时环境（浏览器或Node）提供，如`window`、`XMLRequest`、`Buffer`

## `function Persion() {}`、`var person = Person()`、`var person = new Person()`的区别
`function Persion() {}`只是一个普通的函数声明。使用PascalCase方式命名的函数作为构造函数是一种惯例

`var person = Person()`将`Person`作为普通函数调用而不是构造函数。如果该函数是用作构造函数，那么这种调用方式是一种创建错误，通常情况下构造函数不会返回任何东西，因此向普通函数一样调用构造函数只会返回`undefined`

`var person = new Person()`使用`new`操作符，创建`Person`对象的实例，该实例继承自`Person.prototype`
在使用new的过程中会发生以下事情：
1. 新生成了一个对象
2. 链接到原型
3. 绑定this
4. 返回新对象

```javascript
function Person (name) {
  this.name = name
}

var person = Person()
console.log(person) //undefined

var person = new Person("tom")
console.log(person) // Person { name: "tom" }
```

## `.call`和`.apply`的区别
|          |      `call`   |    `apply`    |
| -------- | ------------- | ------------- |
|  作用    | 指定函数`this` | 指定函数`this` |
| 传参方式 |    以逗号分隔  |      数组      |

``` javascript
let leo = {
	name: "Leo",
	sayHi() {
		console.log("Hi! I'm " + this.name) 
	}
};
let neil = {
	name: "Neil"
};
leo.sayHi(); // "Hi! I'm Leo"
leo.sayHi.call(neil); // "Hi! I'm Neil"
leo.sayHi.call(null); // "Hi! I'm undefined"
var neilSayHi = leo.sayHi.bind(neil)
consolo.log(typeof neilSayHi)  // function
nei.sayHi() // "Hi! I'm Neil"
```

## `bind`
也用于改变`this`的只想相较于`call`、`apply`，`bind`返回的是一个函数
``` javascript
x = 12
function test () {
    console.log(this.x)
}
test()
test.bind({ x: 100 })()

// 12
// 100
```
