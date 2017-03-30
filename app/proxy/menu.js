/**
 * Created by xwatson on 2017/3/30.
 */
const sequelize = require("../models/sequelize.js")
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
        name:menu.name,
        router:menu.router,
        icon:menu.icon,
        // sort:menu.sort, //不更新排序
        parent_id:menu.parent_id,
        status:menu.status,
    },{
        where:{
            id:menu.id
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
    /*sequelize.transaction(() => {
        return Menu.update({ sort:current.sort },{ where:{ id:exchange.id } })
            .then(() => {})
    })*/

    try {
        const exchangeUpdate = await
        if (exchangeUpdate) {
            return await Menu.update({
                sort:exchange.sort
            },{
                where:{
                    id:current.id
                }
            })
        } else {
            return null
        }
    } catch (err) {
        throw err
    }

}
