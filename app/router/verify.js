/**
 * Created by lxj on 2017/3/23.
 */
const service = require('../../config/service.json')
const token = require('../common/token')
import Router from 'koa-router'
const router = new Router()

router.get(`${service.admin}/*`, token.verifyToken)
router.post(`${service.admin}/*`, token.verifyToken)

export default router

