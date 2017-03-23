/**
 * Created by xuwus on 2017/3/23.
 */
const token = require('../common/token')
import Router from 'koa-router'
const router = new Router()

router.get('/service/*', token.verifyToken)
router.post('/service/*', token.verifyToken)

export default router

