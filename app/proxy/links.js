/**
 * Created by lxj on 2017/4/10.
 */
const sequelize = require("../models/sequelize")
const Links = require('../models/links')

/**
 * 根据name获取
 * @param name
 * @returns {Promise.<void>}
 */
exports.getLinksByName = async(name) => {
    return await Links.findOne({
        where:{ name:name }
    })
}

exports.getLinksByWhere = async(where, options) => {
    options = options || {}
    return await Links.findAll({
        where:where,
        ...options
    })
}

/**
 * 根据id获取
 * @param id
 * @returns {Promise.<void>}
 */
exports.getLinksById = async(id) => {
    return await Links.findById(id)
}

/**
 * 创建
 * @param links
 * @returns {Promise.<void>}
 */
exports.createLinks = async(links) => {
    return await Links.create(links)
}

/**
 * 根据id删除
 * @param id
 * @returns {Promise.<void>}
 */
exports.deleteLinks = async(id) => {
    return await Links.destroy({
        where:{ id:id }
    })
}

/**
 * 更新
 * @param links
 * @param id
 * @returns {Promise.<void>}
 */
exports.updateLinks = async(links, id) => {
    return await Links.update(links, { where:{ id:id } })
}
/**
 * 获取所有数据
 * @returns {Promise.<menu>}
 */
exports.getLinksList = async(where ,page, size) => {
    return await Links.findAndCountAll({
        where:where,
        offset:page,
        limit:size
    })
}
/**
 * 获取最大值
 * @param field
 * @param where
 * @returns {Promise.<void>}
 */
exports.max = async(field, where) => {
    return await Links.max(field, where)
}

/**
 * 排序
 * @param current 当前操作分类
 * @param exchange 交换分类
 * @returns {Promise.<void>}
 */
exports.sort = async(current, exchange) => {
    // 启动事务
    return await sequelize.transaction((t) => {
        return Links.update({sort: exchange.sort}, {where: {id: current.id}}, {transaction: t})
            .then(() => {
                return Links.update({sort: exchange.sort}, {where: {id: current.id}}, {transaction: t})
            })
            .then(t.commit.bind(t))
            .catch((err) => {
                console.error(err)
                throw err
            })
    })
}