/**
 * Created by xuwus on 2017/3/23.
 */
const service = require('../../config/service.json')
const admin = require('../controller/admin')
import Router from 'koa-router'
const router = new Router()

router.post('/admin/login', admin.login)
// 创建
router.post(`${service.admin}/admin/create`, admin.create)
// 删除
router.post(`${service.admin}/admin/delete`, admin.delete)
// 修改
router.post(`${service.admin}/admin/update`, admin.update)
// 查询
router.get(`${service.admin}/admin/get`, admin.get)
// 列表
router.get(`${service.admin}/admin/list`, admin.list)


export default router

