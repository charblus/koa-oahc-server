# 启动项目

1. `node app.js`
2. ``

## 开发篇

1. 安装依赖

````bash
npm i koa koa-logger koa-session koa-bodyparser koa-router mongoose sha1 lodash uuid xss bluebird speakeasy --save
````

## 开发笔记

### es5

* `exec`

> exec() 方法用于检索字符串中的正则表达式的匹配。
> 返回一个数组，其中存放匹配的结果。如果未找到匹配，则返回值为 null。
> exec() 方法的功能非常强大，它是一个通用的方法，而且使用起来也比 test() 方法以及支持正则表达式的 String 对象的方法更为复杂。

### es6

* `yield`

> yield 关键字用来暂停和继续一个生成器函数。我们可以在需要的时候控制函数的运行。
> yield 关键字使生成器函数暂停执行，并返回跟在它后面的表达式的当前值。与return类似，但是可以使用next方法让生成器函数继续执行函数yield后面内容，直到遇到yield暂停或return返回或函数执行结束。

* 注意

 1. 使用方法  `function* ge() {}` // 声明时需要添加*，普通函数内部不能使用yield关键字，否则会出错

 2. 参考 --- https://blog.csdn.net/qq_16234613/article/details/52495711

* `function *(next){}`

```js
exports.signup = function *(next) {
  this.body = {
    success: true,
  }
}
```

这是ES6的新feature，function 后面带 * 的叫做generator。
在generator内部你可以使用 yield 语句

* async ... await  异步语法

promise 要用then接收

```js

getProvince().then(data => {
        this.provinces = data
})
```

或者await async

```js
async function test() {
    this.provinces = await getProvince();
}
```

### koa

基于promise的优秀模块, 比如bluebird, q等等

### mongoose

[nodejs中文社区这篇帖子对mongoose的用法总结的不错](https://cnodejs.org/topic/548e54d157fd3ae46b233502)

### 阿里云 子用户 RAM 编程访问
配置：
用户登录名称 oahcoay@1190284634751640.onaliyun.com
AccessKey ID LTAI4Fi1P9jxdkb8S18uYf1A
AccessKeySecret uP4Y8wnZ5uoDDVFXUnVxTtMIkgcgEM

video: 'http://oay-yc.s3-cn-east-1.qiniucs.com',
AK: 'NlAeVZwYeqm4KPxRHWs_lmbSXoDSqNxK2osKC62O',
SK: 'm90diELClUO_DBVbSq7kFBo2sj0Dcb1907rDlSW1'