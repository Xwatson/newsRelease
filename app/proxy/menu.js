/**
 * Created by xwatson on 2017/3/30.
 */
const sequelize = require("../models/sequelize")
const Menu = require('../models/menu')

/**
 * 添加菜单
 * @param menu
 * @returns {Promise.<menu>}
 */
exports.create = async(menu) => {
    return await Menu.create(menu)
}
/**
 * 更新菜单
 * @param menu
 * @returns {Promise}
 */
exports.update = async(menu) => {
    return await Menu.update({
        name: menu.name,
        router: menu.router,
        icon: menu.icon,
        // sort:menu.sort, // 不更新排序
        parent_id: menu.parent_id,
        status: menu.status,
    }, {
        where: {
            id: menu.id
        }
    })
}
/**
 * 排序
 * @param current 当前操作菜单
 * @param exchange 交换菜单
 * @returns {Promise.<void>}
 */
exports.sort = async(current, exchange) => {
    // 启动事务
    return await sequelize.transaction((t) => {
        return Menu.update({sort: exchange.sort}, {where: {id: current.id}}, {transaction: t})
            .then(() => {
                return Menu.update({sort: exchange.sort}, {where: {id: current.id}}, {transaction: t})
            })
            .then(t.commit.bind(t))
            .catch((err) => {
                console.error(err)
                throw err
            })
    })
}
/**
 * 置頂
 * @param menu
 * @returns {Promise.<void>}
 */
exports.stickTop = async(menu) => {
    try {
        return await Menu.max('sort').then((sort) => {
            return Menu.update({sort: sort + 1}, {where: {id: menu.id}})
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}