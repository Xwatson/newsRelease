import Koa from 'koa'
const app = new Koa()
import views from 'koa-views'
import convert from 'koa-convert'
import json from 'koa-json'
import onerror from 'koa-onerror'
import Bodyparser from 'koa-bodyparser'
const bodyparser = Bodyparser()
import logger from 'koa-logger'
import router from './app/router'

onerror(app)

// middlewares
app.use(convert(bodyparser))
app.use(convert(json()))
app.use(convert(logger()))
app.use(convert(require('koa-static')(__dirname + '/public')))
app.use(async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'localhost:3001') // 允许跨域
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token')
    next()
})

// 设置Header，这个header会输出给浏览器客户端，表明这个框架是什么生成的，可以自行修改
app.use(async(ctx, next) => {
    await next()
    ctx.set('X-Powered-By', 'Koa2')
})

app.use(views(__dirname + '/app/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

router(app)

app.use(async(ctx) => {
    if (ctx.status === 404) {
        await ctx.render('error/404');
    }
})

app.use(async(ctx) => {
    if (ctx.status === 404) {
        await ctx.render('./error/404');
    }
})

app.on('error', function(err, ctx){
  logger.error('server error', err, ctx)
})


module.exports = app
