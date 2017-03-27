/**
 * Created by xwatson on 2016/12/23.
 */
import home from './home'
import admin from './admin'
import verify from './verify'

const routes = [home, verify, admin]
export default (app) => {
    routes.forEach((route) => {
        app
            .use(route.routes())
            .use(route.allowedMethods({
                throw: true
            }))
    })
}