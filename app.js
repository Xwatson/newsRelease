import Koa from 'koa'
const app = new Koa()
// import path from 'path'
import views from 'koa-views'
import convert from 'koa-convert'
import json from 'koa-json'
import onerror from 'koa-onerror'
// import Bodyparser from 'koa-bodyparser'
import body from 'koa-better-body'
import logger from 'koa-logger'
import router from './app/router'
import session from "koa2-cookie-session"

onerror(app)

// middlewares
// app.use(convert(Bodyparser()))
app.use(session({
    key: "NEWS_RELEASE_SESSION"
}))
app.use(convert(body()))
app.use(convert(json()))
app.use(convert(logger()))
app.use(convert(require('koa-static')(__dirname + '/public')))

// 设置Header，这个header会输出给浏览器客户端，表明这个框架是什么生成的，可以自行修改
app.use(async(ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*') // 允许跨域
    ctx.set('Access-Control-Allow-Methods', 'GET, POST')
    ctx.set('Access-Control-Allow-Headers', 'Origin,Cache-Control,X_Requested_With,X-Requested-With,Content-Type,Accept,authToken')
    ctx.set('X-Powered-By', 'Koa2')
    if (ctx.req.method === 'POST') {
        ctx.request.body = ctx.request.fields
    }
    return await next()
})

app.use(views(__dirname + '/app/views', {
  extension: 'ejs'
}))

router(app)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


app.use(async(ctx) => {
    if (ctx.status === 404) {
        await ctx.render('error/404');
    }
})

app.on('error', function(err, ctx){
  console.log('server error', err, ctx)
})


module.exports = app
