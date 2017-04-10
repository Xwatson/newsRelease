/**
 * Created by xuwus on 2017/4/10.
 */
const sequelize = require("../models/sequelize")
const Category = require('../models/category')

/**
 * 根据name获取分类
 * @param name
 * @returns {Promise.<void>}
 */
exports.getCategoryByName = async(name) => {
    return await Category.findOne({ where:{
        name:name
    } })
}

/**
 * 根据id获取分类
 * @param id
 * @returns {Promise.<void>}
 */
exports.getCategoryById = async(id) => {
    return await Category.findById(id)
}

/**
 * 创建
 * @param category
 * @returns {Promise.<void>}
 */
exports.createCategory = async(category) => {
    return await Category.create(category)
}

/**
 * 根据id删除
 * @param id
 * @returns {Promise.<void>}
 */
exports.deleteCategory = async(id) => {
    return await Category.destroy({
        where:{ id:id }
    })
}

/**
 * 更新
 * @param category
 * @param id
 * @returns {Promise.<void>}
 */
exports.updateCategory = async(category, id) => {
    return await Category.update(category, { where:{ id:id } })
}

/**
 * 置頂
 * @param category
 * @returns {Promise.<void>}
 */
exports.stickTop = async(category) => {
    try {
        return await Category.max('sort', { where:category.parent_id }).then((category) => {
            return Category.update({sort: category.sort + 1}, {where: {id: category.id}})
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
    return await Category.max(field, where)
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
        return Category.update({sort: exchange.sort}, {where: {id: current.id}}, {transaction: t})
            .then(() => {
                return Category.update({sort: exchange.sort}, {where: {id: current.id}}, {transaction: t})
            })
            .then(t.commit.bind(t))
            .catch((err) => {
                console.error(err)
                throw err
            })
    })
}