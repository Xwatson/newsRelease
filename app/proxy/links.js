/**
 * Created by xuwus on 2017/4/10.
 */
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
