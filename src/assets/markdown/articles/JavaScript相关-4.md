---
title: JavaScript相关-4
date: 2020-02-17 22:25:05
tags: Javascript 进阶
categories: JavaScript
---

## 模拟实现call、apply

实现思路：

- 不传入第一个参数，那么默认为`window`
- 改变了`this`指向，让新对象可以执行该函数，那个思路可以变成给新对象添加一个函数，然后在执行完成之后删除

``` javascript
Function.prototype.myCall = function (context) {
  context = context || window
  context.fn = this
  const args = [...arguments].slice(1)
  const result = context.fn(...args)
  delete context.fn
  return result
}

Function.prototype.myApply = function(context) {
  context = context || window
  context.fn = this
  const result = arguments[1] ? context.fn(...arguments[1]) : context.fn()
  delete context.fn
  return result
}

Function.prototype.myBind = function(context) {
  if (typeof this !== 'function')
    throw new TypeError("error")
  const that = this
  const args = [...arguments].slice(1)
  return function F() {
    if (this instanceof F) {
      return new that(...args, ...arguments)
    }
    return that.apply(context, args.concat(...arguments))
  }
}

const tom = {
  name: "tom",
  say (tmp1, tmp2) {
    console.log(this.name, tmp1, tmp2);
  }
}
const jack = {
  name: "jack"
}

tom.say.myCall(jack, "111", "222")
tom.say.call(jack, "111", "222")

tom.say.myApply(jack, ["111", "222"])
tom.say.apply(jack, ["111", "222"])

tom.say.myBind(jack)("111", "222")
tom.say.bind(jack)("111", "222")

// jack 111 222
// jack 111 222
// jack 111 222
// jack 111 222
// jack 111 222
// jack 111 222
```

## Promise 实现

`Promise`是ES6新增的语法，解决了回调地狱的问题。可以把`Promise`看作是一个状态机，可以通过函数`resolve`和`reject`将状态转变为`resolved`或`rejected`，状态一旦转变就不能再次变化

`then`函数会返回一个新的`Promise`实例。因为`Promise`规范规定除了`pending`状态，其他状态是不可以改变的，如果返回的是一个相同实例的话，多个`then`调用就失去意义了

对于`then`，本质上可以把它看成是`flatMap`

## Proxy

proxy是ES6中新增的功能，用来定义对象中的操作

``` javascript
function onwatch(obj, setBind, getLogger) {
  const handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value) {
      setBind(target, property, value)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}

let obj = { a: 1 }
let p = onwatch(obj, (target, property, value) => {
  console.log(`set ${ property } = ${ value }`);
}, (target, property) => {
  console.log(`get ${ property } = ${ target[property] }`);
})

p.a = 2
console.log(p.a);

// set a = 2
// get a = 2
```

## 正则表达式

**元字符**

| 元字符 |             作用             |
| :----: | :--------------------------: |
|   .    | 匹配任意字符除了换行、回车符 |
|   ?    |        ？之前字符可选        |
|  [ ]   |     匹配方括号内任意字符     |
|   ^    |      ^9表示匹配以9开头       |
| {1, 2} |        匹配1到2位字符        |
| (abc)  |          只匹配abc           |
|   \|   |      匹配\|前后任意字符      |
|   \    |             转义             |
|   *    |   只匹配0次及以上*前的字符   |
|   +    |   只匹配1次及以上*前的字符   |

**修饰语**

| 修饰语 |    作用    |
| :----: | :--------: |
|   i    | 忽略大小写 |
|   g    |  全局搜索  |
|   m    |    多行    |

**字符简写**

| 简写 |         作用         |
| :--: | :------------------: |
|  \w  | 匹配字母数字或下划线 |
|  \W  |       和👆相反        |
|  \s  |    匹配任意的字符    |
|  \d  |       匹配数字       |
|  \b  | 匹配单词的开始或结束 |

## 垃圾回收机制

**WHAT**

不再用到的内存没有及时释放，就叫做内存泄漏。如果这种情况越来越多，会导致内存不够用而系统崩溃。很多编程语言需要手动释放内存，但也有一部分编程语言提供自动内存管理，这被称为垃圾回收机制。

**WHY**

避免出现内存泄漏

**HOW**

V8下的垃圾回收机制：

V8实现了准确式GC，GC算法采用了分代式垃圾回收机制，因此V8将内存（堆）分为**新生代**和**老生代**两部分

- 新生代算法

  新生代中的对象一般存活时间较短，使用 scavenge GC 算法

  在新生代空间中，内存空间分为两部分，分别为**from空间**和**to空间**。在这两个空间中，必定有一个空间时使用的，另一个空间是空闲的。新分配的对象会被放入from空间中。当from空间被占满时，新生代GC就会启动了。算法会检查from空间中存活的对象并复制到to空间中，如果有失活的对象就会销毁。当复制完成后将from空间和to空间互换，这样GC就结束了

- 老生代算法

  老生代中的对象一般存活事件较常切数量也多，使用了两个算法，分别是标记清除算法和标记压缩算法

  以下情况对象会出现在老生代空间中

  - 新生代中的对象已经历过一次scavenge算法
  - to空间中的对象占比大小超过25%，在这种情况下，为了不影响到内存分配，会将对象从新生代空间移到老生代空间中

  在老生代中，以下情况会启动标记清除算法

  - 某一空间没有分块的时候
  - 空间不能保证新生代中的对象移动到老生代中

  在这个阶段中，会遍历堆中所有的对象，然后标记活的对象，在标记完成后，销毁所有没有被标记的对象。在标记大型堆内存时，可能需要几百毫秒才能完成一次标记，这就会导致一些性能上的问题。为了解决这个问题，2011年V8从stop-the-world标记切换到增量标记

  清除对象后会造成堆内存出现碎片的情况，当碎片超过一定先之后会启动压缩算法，在压缩过程中将活的对象向一端移动，直到所有对象都移动完成后清理掉不需要的内存

## 继承

1. 经典继承（构造函数）

   ``` js
   function Father(colors) {
     this.colors = colors
   }
   function Son(colors) {
     Father.call(this, colors)
   }
   
   let s = new Son(["red", "green", "blue"])
   console.log(s.colors);
   ```

   优点：

   ​	可以传递构造参数

   缺点：

   - 继承的方法都在构造函数中定义，构造函数不能够复用了
   - 父类中定义的方法对于子类而言是不可见的

2. 原型继承

   ``` js
   function object(o) {
     function F() {}
     F.prototype = o
     return new F()
   }
   
   let person = {
     name: "tom",
     friends: ["jack", "linda"]
   }
   let p1 = object(person)
   p1.name = "p1"
   p1.friends.push("bob")
   let p2 = Object.create(person)
   p2.name = "p2"
   p2.friends.push("lili")
   
   console.log(person.friends);
   ```

   在`object`函数内部，先创建了一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个实例。从本质上讲，`object()`将传入其中的对象执行了一次**浅复制**

   原型继承适用于只想让一个对象与另一个对象保持类似的情况

3. 组合继承 👍

   ``` js
   function Father(name) {
     this.name = name
     this.colors = ["red", "green", "blue"]
   }
   Father.prototype.sayName = function() {
     console.log(this.name)
   }
   
   function Son(name, age) {
     // 继承父类属性，第一次调用Father() 
     Father.call(this, name)
     this.age = age
   }
   // 继承父类方法，第二次调用Father()
   Son.prototype = new Father()
   Son.prototype.sayAge = function() {
     console.log(this.age)
   }
   
   const s1 = new Son("tom", 21)
   s1.colors.push("black")
   console.log(s1.colors)
   s1.sayAge()
   s1.sayName()
   
   const s2 = new Son("jack", 22)
   console.log(s2.colors)
   
   ```

4. 寄生式继承

   寄生式继承是与原型链继承紧密相关的一种思路。寄生式继承的思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真的是它做了所有工作一样返回对象。

   ``` js
   function createAnother(original) {
       // object(): 任何能返回新对象的函数
       const clone = object(original)
       clone.sayHi = function() {
           conosle.log("hi")
       }
       return clone                
   }
   ```

5. 寄生组合式继承 👍👍

   组合继承的最大问题在于无论什么情况下都会调用两次父类型构造函数

   寄生组合式继承即**通过借用构造函数来继承属性，通过原型链的混成形式来继承方法**

   ``` js
   function inheritPrototype(subType, superType) {
     const prototype = Object.create(superType.prototype)
     prototype.constructor = subType
     subType.prototype = prototype
   }
   
   function SuperType(name) {
     this.name = name
     this.colors = ["red", "green", "blue"]
   }
   SuperType.prototype.sayName = function() {
     console.log(this.name)
   }
   
   function SubType(name, age) {
     SuperType.call(this, name)
     this.age = age
   }
   inheritPrototype(SubType, SuperType)
   SubType.prototype.sayAge = function() {
     console.log(this.age)
   }
   
   let sub1 = new SubType("sub1", 21)
   sub1.sayAge()
   sub1.sayName()
   ```

   