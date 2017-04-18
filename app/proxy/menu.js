/**
 * Created by xwatson on 2017/3/30.
 */
const sequelize = require("../models/sequelize")
const Menu = require('../models/menu')

/**
 * 获取所有
 * @param id
 * @param where
 * @param page
 * @param size
 * @returns {Promise.<menu>}
 */
exports.getMenus= async(where ,page, size) => {
    return await Menu.findAndCountAll({
        where:where,
        offset:page,
        limit:size
    })
}
/**
 * 根据Id获取菜单
 * @param id
 * @returns {Promise.<menu>}
 */
exports.getMenuById = async(id) => {
    return await Menu.findOne({ where:{ id:id } })
}

exports.getMenuByWhere = async(where) => {
    return await Menu.findAll({ where:where })
}
/**
 * 根据name获取菜单
 * @param name
 * @returns {Promise.<menu>}
 */
exports.getMenuByName = async(name) => {
    return await Menu.findOne({ where:{ name:name } })
}
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
 * @param id
 * @returns {Promise}
 */
exports.update = async(menu, id) => {
    return await Menu.update(menu, { where:{ id:id } })
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
        return await Menu.max('sort', { where:menu.parent_id }).then((menu) => {
            return Menu.update({sort: menu.sort + 1}, {where: {id: menu.id}})
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}
/**
 * 获取最大值
 * @param field
 * @param where
 * @returns {Promise.<void>}
 */
exports.max = async(field, where) => {
    return await Menu.max(field, where)
}
/**
 * 删除
 * @param id
 * @returns {Promise.<void>}
 */
exports.delete = async(id) => {
    return await Menu.destroy({
        where:{ id: id }
    })
}