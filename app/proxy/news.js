/**
 * Created by lxj on 2017/4/10.
 */
const News = require('../models/news')
const Category = require('../models/category')

/**
 * 根据name获取新闻
 * @param name
 * @returns {Promise.<void>}
 */
exports.getNewsByName = async(name) => {
    return await News.findOne({ include:[Category] }, {
        where:{ name:name }
    })
}

/**
 * 根据id获取新闻
 * @param id
 * @returns {Promise.<void>}
 */
exports.getNewsById = async(id) => {
    return await News.findById(id, { include:[{ model: Category, required: true, as:'Category'}] })
}

/**
 * 根据分类id获取新闻
 * @param categoryId
 * @returns {Promise.<void>}
 */
exports.getNewsBycategoryId = async(categoryId) => {
    return await News.findAll({ where:{ category_id:categoryId } })
}

/**
 * 创建
 * @param news
 * @returns {Promise.<void>}
 */
exports.createNews = async(news) => {
    return await News.create(news)
}

/**
 * 根据id删除
 * @param id
 * @returns {Promise.<void>}
 */
exports.deleteNews = async(id) => {
    return await News.destroy({
        where:{ id:id }
    })
}

/**
 * 更新
 * @param news
 * @param id
 * @returns {Promise.<void>}
 */
exports.updateNews = async(news, id) => {
    return await News.update(news, { where:{ id:id } })
}
/**
 * 获取所有
 * @param id
 * @param where
 * @param page
 * @param size
 * @returns {Promise.<menu>}
 */
exports.getNewsList= async(where, page, size) => {
    return await News.findAndCountAll({
        where:where,
        offset:page,
        limit:size
    })
}