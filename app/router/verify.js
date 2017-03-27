/**
 * Created by xuwus on 2017/3/23.
 */
const token = require('../common/token')
import Router from 'koa-router'
const router = new Router()

router.get('/news_service/*', token.verifyToken)
router.post('/news_service/*', token.verifyToken)

export default router

