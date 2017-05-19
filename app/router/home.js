/**
 * Created by xwatson on 2016/12/23.
 */
import Router from 'koa-router'
const router = new Router()

import { home, category, details, login, register, search, account } from '../controller/pages'

router.get('/', home)
router.get('/nav/:category', category)
router.get('/details/:id', details)
router.get('/search', search)
router.get('/login', login)
router.get('/register', register)
router.get('/account', account)

export default router
