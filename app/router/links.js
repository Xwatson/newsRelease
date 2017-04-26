/**
 * Created by xwatson on 2017/4/2.
 */
const service = require('../../config/service.json')
const links = require('../controller/links')
import Router from 'koa-router'
const router = new Router()

// 创建
router.post(`${service.admin}/links/create`, links.create)
// 删除
router.post(`${service.admin}/links/delete`, links.delete)
// 修改
router.post(`${service.admin}/links/update`, links.update)
// 查询
router.get(`${service.admin}/links/get`, links.get)
// 列表
router.get(`${service.admin}/links/list`, links.list)

export default router