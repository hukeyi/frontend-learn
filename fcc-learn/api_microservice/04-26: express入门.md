[toc]

# freeCodeCamp

- API 和微服务部分
- 项目在[replit](https://replit.com/@hukeyi)，用 GitHub 账号登录

## package.json

### JSON 语法

- 不能有尾逗号
- 属性名和属性值均必须用**双**引号包裹

### 包的版本号管理

`version: MAJOR.MINOR.PATCH;`

MAJOR: 主要号，不能向下兼容的版本更新，大更新
MINOR: 次要号，小更新，可向下兼容
PATCH: 修订号，bug 修订

`~`：表示接受所有修复号的更新，如果是`~1.2.8`表示接受`1.2.x`的全部更新
`^`：表示接受所有次要号和修订号的更新，`^1.2.8`表示接受`1.x.x`的全部更新

## Node & Express

注意：Express 是自上而下解析文件的，所以之后要注意函数的顺序。比如给路径'/name'设置中间件函数的代码`app.use(middleware)`应排在其路由设置`app.get('/name', handler)`之前

`__dirname`：Node 全局变量，当前文件路径

`process.env`：Node 全局变量，环境变量对象，包含了`.env`文件中设置的所有变量。`.env`文件中语法为`变量名=变量值`，注意等号前后都没有括号

### 设置路由

`app.METHOD(PATH, HANDLER)`

METHOD：请求方法，小写，get post put delete
PATH: 绝对路径
HANDLER 长这样：

```
function(req, res){
    //do something here
}
```

在 HANDLER 内部：
`res.send(<string>)`：给请求响应一个字符串
`res.sendFile(<path>)`：给请求响应一个文件，path 为文件绝对路径
`res.json(<json>)`：给请求响应一个 json 数据

```
var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('Hello Express');
})

module.exports = app;
```

### 设置中间件函数

`app.use(path, middlewareFunction)`：对所有请求方法均有效
`app.METHOD(path. middlewareFunction)`：对特定请求方法有效
path 可选
middlewareFunction 长这样：

```
function(req, res, next){
  const {method, path, ip} = req;
  console.log(`${method} ${path} - ${ip}`);
  next();
}
```

`express.static(path)`：path 为绝对路径，express 的中间件

```
let path = __dirname + '/public';
app.use('/public', express.static(path));
```

### 获取 get 请求 url 中的参数

`req.params`：url 中的变量（e.g. /user/:id 中的 id）
`req.query`：url 中的查询参数 (e.g. /user?id=1&name=test)

### 获取 post 请求的参数

首先设置 body-parser 中间件：

```
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}))

```

然后拿 post 数据：
`req.body.[params_name]`：post 请求的数据在 request 的 body 中

### 链式调用中间件

路由定义函数中设置中间件：
`app.METHOD(PATH, MIDDLEWARE, HANDLER)`

### 链式调用请求

`app.route(path).get(handler).post(handler)`
