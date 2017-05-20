/**
 * Created by xwatson on 2016/12/23.
 */
import Router from 'koa-router'
const router = new Router()

import { home, category, details, login, register, search, account, maintain, close, getSiteConfig } from '../controller/pages'

router.get('/*', async(ctx, next) => {
    const site = await getSiteConfig()
    if (site.status === 'MAINTAIN') {
        return await ctx.render('maintain', {})
    } else if (site.status === 'CLOSE') {
        return await ctx.render('close', {})
    }
    ctx.siteConfig = site
    await next()
})
router.get('/', home)
router.get('/nav/:category', category)
router.get('/details/:id', details)
router.get('/search', search)
router.get('/login', login)
router.get('/register', register)
router.get('/account', account)
router.get('/account', account)
router.get('/maintain', maintain)
router.get('/close', close)

export default router
