/**
 * Created by xwatson on 2017/4/2.
 */
const service = require('../../config/service.json')
const comment = require('../controller/comment')
import Router from 'koa-router'
const router = new Router()

// 创建
router.post(`${service.admin}/comment/create`, comment.create)
// 删除
router.post(`${service.admin}/comment/delete`, comment.delete)
// 修改
router.post(`${service.admin}/comment/update`, comment.update)
// 查询
router.get(`${service.admin}/comment/get/:id`, comment.get)
// 列表
router.get(`${service.admin}/comment/list`, comment.list)

export default router