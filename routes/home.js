/**
 * Created by xuwus on 2017/3/7.
 */
var router = require('koa-router')()

router.get('/', async function (ctx, next) {
    ctx.state = {
        title: 'koa2 title'
    }

    await ctx.render('home', {
    })
})
export default router