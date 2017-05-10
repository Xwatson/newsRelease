/**
 * Created by xwatson on 2017/4/2.
 */
const service = require('../../config/service.json')
const category = require('../controller/category')
import Router from 'koa-router'
const router = new Router()

// 创建
router.post(`${service.admin}/category/create`, category.create)
// 删除
router.post(`${service.admin}/category/delete`, category.delete)
// 修改
router.post(`${service.admin}/category/update`, category.update)
// 查询
router.get(`${service.admin}/category/get/:id`, category.get)
// 列表
router.get(`${service.admin}/category/list`, category.list)

export default router