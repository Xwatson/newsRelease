/**
 * Created by xwatson on 2017/5/10.
 */
const service = require('../../config/service.json')
const siteConfig = require('../controller/siteConfig')
import Router from 'koa-router'
const router = new Router()

// 修改
router.post(`${service.admin}/siteConfig/update`, siteConfig.update)
// 查询
router.get(`${service.admin}/siteConfig/get`, siteConfig.get)

export default router