/**
 * Created by xuwus on 2017/4/10.
 */
const Comment = require('../models/comment')
const News = require('../models/news')
const User = require('../models/user')

/**
 * 根据name获取
 * @param name
 * @returns {Promise.<void>}
 */
exports.getCommentByName = async(name) => {
    return await Comment.findOne({ include:[News, User] }, {
        where:{ name:name }
    })
}

/**
 * 根据id获取
 * @param id
 * @returns {Promise.<void>}
 */
exports.getCommentById = async(id) => {
    return await Comment.findById(id, { include:[News, User] })
}

/**
 * 根据新闻id获取
 * @param newsId
 * @returns {Promise.<void>}
 */
exports.getCommentBycategoryId = async(newsId) => {
    return await Comment.findAll({ where:{ news_id:newsId } })
}

/**
 * 根据用户id获取
 * @param userId
 * @returns {Promise.<void>}
 */
exports.getCommentBycategoryId = async(userId) => {
    return await Comment.findAll({ where:{ user_id:userId } })
}

/**
 * 创建
 * @param comment
 * @returns {Promise.<void>}
 */
exports.createComment = async(comment) => {
    return await Comment.create(comment)
}

/**
 * 根据id删除
 * @param id
 * @returns {Promise.<void>}
 */
exports.deleteComment = async(id) => {
    return await Comment.destroy({
        where:{ id:id }
    })
}

/**
 * 更新
 * @param comment
 * @param id
 * @returns {Promise.<void>}
 */
exports.updateComment = async(comment, id) => {
    return await News.update(comment, { where:{ id:id } })
}
