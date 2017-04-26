/**
 * Created by xwatson on 2016/12/23.
 */

import verify from './verify'
import home from './home'
import admin from './admin'
import operation from './operation'
import menu from './menu'
import auth from './auth'
import category from './category'
import comment from './comment'
import links from './links'
import news from './news'
import user from './user'

const routes = [home, verify, admin, operation, menu, auth, category, comment, links, news, user]
export default (app) => {
    routes.forEach((route) => {
        app
            .use(route.routes())
            .use(route.allowedMethods({
                throw: true
            }))
    })
}