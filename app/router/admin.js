/**
 * Created by xuwus on 2017/3/23.
 */
const service = require('../../config/service.json')
const admin = require('../controller/admin')
import Router from 'koa-router'
const router = new Router()

router.post('/admin/login', admin.login)
router.post(`${service.admin}/admin/create`, admin.create)

export default router

