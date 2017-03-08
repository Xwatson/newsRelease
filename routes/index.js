/**
 * Created by xuwus on 2017/3/7.
 */
const router = require('koa-router')()
import home from './home'

export default (app, router) => {
    console.log('aa', app)
   app.use(router.get('/', home.routes(), home.allowedMethods()))

}