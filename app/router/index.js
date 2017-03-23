/**
 * Created by xwatson on 2016/12/23.
 */
import home from './home'
import admin from './admin'
const routes = [home, admin]
export default (app) => {
    routes.forEach((route) => {
        app
            .use(route.routes())
            .use(route.allowedMethods({
                throw: true
            }))
    })
}