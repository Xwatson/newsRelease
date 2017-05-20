/**
 * Created by lxj on 2017/4/10.
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
    return await Comment.findOne({ include:[
        { model: News, as:'News'},
        { model: User, as:'User'}
    ] }, {
        where:{ name:name }
    })
}

/**
 * 根据id获取
 * @param id
 * @returns {Promise.<void>}
 */
exports.getCommentById = async(id) => {
    return await Comment.findById(id, { include:[
        { model: News, as:'News'},
        { model: User, as:'User'}
    ] })
}
/**
 * 根据user id获取
 * @param id
 * @returns {Promise.<void>}
 */
exports.getCommentByUserId = async(id) => {
    return await Comment.findAll({
        include:[
            { model: News, as:'News'},
            { model: User, as:'User'}
        ],
        where:{ user_id:id }
    })
}
/**
 * 根据news id获取
 * @param id
 * @returns {Promise.<void>}
 */
exports.getCommentByNewsId = async(id, options, where) => {
    options = options || {}
    where = where || {}
    return await Comment.findAll({
        include:[
            { model: User, as:'User'}
        ],
        where:{ news_id:id, ...where },
        ...options
    })
}

/**
 * 根据新闻id获取
 * @param newsId
 * @returns {Promise.<void>}
 */
exports.getCommentBycategoryId = async(newsId) => {
    return await Comment.findAll({
        include:[
            { model: News, as:'News'},
            { model: User, as:'User'}
        ],
        where:{ news_id:newsId }
    })
}

/**
 * 根据用户id获取
 * @param userId
 * @returns {Promise.<void>}
 */
exports.getCommentBycategoryId = async(userId) => {
    return await Comment.findAll({
        include:[
            { model: News, as:'News'},
            { model: User, as:'User'}
        ],
        where:{ user_id:userId }
    })
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
 * 根据user id删除
 * @param id
 * @returns {Promise.<void>}
 */
exports.deleteCommentByUserId = async(id) => {
    return await Comment.destroy({
        where:{ user_id:id }
    })
}

/**
 * 更新
 * @param comment
 * @param id
 * @returns {Promise.<void>}
 */
exports.updateComment = async(comment, id) => {
    return await Comment.update(comment, { where:{ id:id } })
}
/**
 * 获取所有数据
 * @returns {Promise.<menu>}
 */
exports.getCommentList = async(where ,page, size, newsWhere, userWhere) => {
    return await Comment.findAndCountAll({
        include:[
            { model: News, as:'News', where:newsWhere },
            { model: User, as:'User', where:userWhere }
        ],
        where:where,
        offset:page,
        limit:size
    })
}