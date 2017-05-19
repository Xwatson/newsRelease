/**
 * Created by xwatson on 2017/4/2.
 */
const service = require('../../config/service.json')
const comment = require('../controller/comment')
import Router from 'koa-router'
const router = new Router()

// 评论提交
router.post(`/comment/submit`, comment.submit)
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
// 审核
router.post(`${service.admin}/comment/review`, comment.review)

export default router