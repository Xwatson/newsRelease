/**
 * Created by xwatson on 2016/12/23.
 */
import Router from 'koa-router'
const router = new Router()

import home from '../controller/home'

router.get('/', home)

export default router
