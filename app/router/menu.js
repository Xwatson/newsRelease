/**
 * Created by xwatson on 2017/4/2.
 */
const service = require('../../config/service.json')
const menu = require('../controller/menu')
import Router from 'koa-router'
const router = new Router()

// 创建
router.post(`${service.admin}/menu/create`, menu.create)
// 删除
router.post(`${service.admin}/menu/delete`, menu.delete)
// 修改
router.post(`${service.admin}/menu/update`, menu.update)
// 查询
router.get(`${service.admin}/menu/get`, menu.get)
// 列表
router.get(`${service.admin}/menu/list`, menu.list)

export default router