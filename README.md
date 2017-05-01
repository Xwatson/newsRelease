# newsRelease
基于koa2,sequelize,mysql新闻发布系统

### koa2特点
- 一个轻量优雅的中间件框架，几乎所有的功能都需要由第三方中间件完成
- 通过组合不同的 generator，可以免除重复繁琐的回调函数嵌套，并极大地提升错误处理的效率
- 支持ES7 async/await 函数

### sequelize
- 基于Promise实现异步流程控制
- 面向对象方式操作数据库

### 数据库配置
- config/database.json文件
```bash
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
├── config                   # 项目配置
│   ├── database.json        # 数据库配置
│   ├── service.json         # 接口服务配置
├── public                   # 静态资源
├── app                      # 程序源文件目录
│   ├── common               # 内部静态资源
│   ├── controller           # 控制器逻辑
│   ├── models               # 数据库模型
│   ├── proxy                # 代理方法
│   ├── route                # 路由配置
│   │   ├── index.js         # 所有路由集合
│   ├── views                # 页面视图
├── app.js                   # 程序入口文件
└── package.json             # 项目配置
```