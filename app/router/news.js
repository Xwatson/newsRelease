/**
 * Created by xwatson on 2017/4/2.
 */
const service = require('../../config/service.json')
const news = require('../controller/news')
import Router from 'koa-router'
const router = new Router()

// 创建
router.post(`${service.admin}/news/create`, news.create)
// 删除
router.post(`${service.admin}/news/delete`, news.delete)
// 修改
router.post(`${service.admin}/news/update`, news.update)
// 查询
router.get(`${service.admin}/news/get/:id`, news.get)
// 列表
router.get(`${service.admin}/news/list`, news.list)

export default router