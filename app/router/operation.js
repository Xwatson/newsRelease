/**
 * Created by xwatson on 2017/4/2.
 */
const service = require('../../config/service.json')
const operation = require('../controller/operation')
import Router from 'koa-router'
const router = new Router()

// 创建
// router.post(`${service.admin}/operation/create`, operation.create)
// 删除
// router.post(`${service.admin}/operation/delete`, operation.delete)
// 修改
// router.post(`${service.admin}/operation/update`, operation.update)
// 查询
router.get(`${service.admin}/operation/get/:id`, operation.get)
// 列表
router.get(`${service.admin}/operation/list`, operation.list)

export default router