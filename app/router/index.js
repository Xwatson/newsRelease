/**
 * Created by xwatson on 2016/12/23.
 */
import home from './home'
const routes = [home]
export default function (app) {
    routes.forEach((route) => {
        app
            .use(route.routes())
            .use(route.allowedMethods({
                throw: true
            }))
    })
}