/**
 * Created by xuwus on 2017/3/7.
 */
import Router from 'koa-router'
const router = new Router()

router.get('/', async function (ctx, next) {
    ctx.state = {
        title: 'koa2 title'
    }
    await ctx.render('home', {
    })
})
export default router