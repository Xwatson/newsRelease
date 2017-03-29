/**
 * Created by xuwus on 2017/3/23.
 */
const admin = require('../controller/admin')
import Router from 'koa-router'
const router = new Router()

router.post('/login', admin.login)
router.post('/news_service/admin/create', admin.create)

export default router

