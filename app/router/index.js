/**
 * Created by xwatson on 2016/12/23.
 */

import verify from './verify'
import home from './home'
import admin from './admin'
import operation from './operation'
import menu from './menu'
import auth from './auth'

const routes = [home, verify, admin, operation, menu, auth]
export default (app) => {
    routes.forEach((route) => {
        app
            .use(route.routes())
            .use(route.allowedMethods({
                throw: true
            }))
    })
}