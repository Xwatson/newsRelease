/**
 * Created by xuwus on 2017/4/26.
 */
const service = require('../../config/service.json')
const user = require('../controller/user')
import Router from 'koa-router'
const router = new Router()

// 创建
router.post(`${service.admin}/user/create`, user.create)
// 删除
router.post(`${service.admin}/user/delete`, user.delete)
// 修改
router.post(`${service.admin}/user/update`, user.update)
// 查询
router.get(`${service.admin}/user/get`, user.get)
// 列表
router.get(`${service.admin}/user/list`, user.list)

export default router