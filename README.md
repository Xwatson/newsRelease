### 项目介绍
> 新闻发布系统服务端，实现管理员的所有功能，提供service api和web页面模式。<br/>
service api主要提供给前端管理系统，web页面提供新闻展示界面等。<br/>
技术方面采用nodejs开发web服务端，基于koa2框架，使用sequelize ORM框架操作mysql数据库。
### koa介绍
> koa由 Express 原班人马打造的 koa，<br />
> 一个轻量优雅的中间件框架，几乎所有的功能都需要由第三方中间件完成<br />
> koa通过组合不同的generator，可以繁琐的回调函数嵌套，极大地提升错误处理的效率<br />
> koa2支持ES7 async/await 函数

### sequelize介绍
> Sequelize是一个基于promise的关系型数据库ORM框架。<br/>
Sequelize是在SQL之上进行抽象、封装，我们可以使用面向对象的方式来操作表，功能丰富，
可以非常方便的进行连表查询，事务等操作，从而提高开发效率。

### 数据库配置
- config/database.json文件
```
{
    "dialect": "mysql",
    "host": "服务器地址",
    "port": 端口号,
    "userName": "链接数据库用户名",
    "password": "密码",
    "databaseName": "数据库名称",
    "ssl": false,
    "timezone": "+08:00"
}
```
- 程序启动后会根据app/models下所有文件自动创建表

### 启动
*install 安装依赖*
```bash
npm install
```
*npm 运行启动服务*
```bash
npm run start
```
### 结构

```
.
├── bin                      # 启动脚本
│   ├── run                  # 启动脚本入口
│   ├── www                  # http服务配置
├── config                   # 项目配置
│   ├── database.json        # 数据库配置
│   ├── service.json         # 接口服务配置
├── public                   # 静态资源
├── app                      # 程序源文件目录
│   ├── common               # 公共目录
│   │   ├── encipher.js      # 密码加密类
│   │   ├── responseCode.js  # 请求返回代码
│   │   ├── token.js         # 登录token生成类
│   ├── controller           # 控制器逻辑，负责请求后处理数据返回json
│   ├── models               # 数据库模型，负责数据库表定义
│   ├── proxy                # 代理方法，负责进行数据库操作中间代理层
│   ├── route                # 路由配置
│   │   ├── index.js         # 所有路由集合
│   ├── views                # 页面视图，负责新闻展示的所有页面
├── app.js                   # 程序入口文件
└── package.json             # 项目配置文件
```