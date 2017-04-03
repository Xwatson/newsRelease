/**
 * Created by xwatson on 2017/4/2.
 */
const service = require('../../config/service.json')
const auth = require('../controller/auth')
import Router from 'koa-router'
const router = new Router()

// 创建
router.post(`${service.admin}/auth/create`, auth.create)
// 删除
router.post(`${service.admin}/auth/delete`, auth.delete)
// 修改
router.post(`${service.admin}/auth/update`, auth.update)
// 查询
router.get(`${service.admin}/auth/get`, auth.get)
// 列表
router.get(`${service.admin}/auth/list`, auth.list)

export default router