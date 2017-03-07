/**
 * Created by xuwus on 2017/3/7.
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