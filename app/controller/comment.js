/**
 * Created by lxj on 2017/4/22.
 */
const responseCode = require('../common/responseCode')
const Comment = require('../proxy/comment')
const User = require('../proxy/user')
const News = require('../proxy/news')
const errLog = '评论控制器：'

exports.submit = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    try {
        if (!ctx.session.user) {
            message.code = responseCode.AUTH_EXPIRED
            message.message = '登录超时，请重新登录'
            ctx.body = message
            return ctx
        }
        const news = await News.getNewsById(data.news_id)
        if (!news) {
            message.code = responseCode.FAIL
            message.message = '新闻不存在'
            ctx.body = message
            return ctx
        }
        const comment = await Comment.createComment({
            user_id:ctx.session.user.id,
            news_id:data.news_id,
            content:data.content,
            status:'PASS' // 默认审核通过
        })
        if (comment) {
            message.code = responseCode.SUCCESS
            message.message = '评论成功'
            message.data = comment
        } else {
            message.code = responseCode.FAIL
            message.message = '评论失败，请重试！'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}添加评论出错：`, err)
        throw err
    }
}
/**
 * 创建
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.create = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    try {
        const user = await User.getUserById(data.user_id)
        if (!user) {
            message.code = responseCode.FAIL
            message.message = '关联用户不存在'
            ctx.body = message
            return ctx
        }
        const news = await News.getNewsById(data.news_id)
        if (!news) {
            message.code = responseCode.FAIL
            message.message = '关联新闻不存在'
            ctx.body = message
            return ctx
        }
        const comment = await Comment.createComment({
            user_id:data.user_id,
            news_id:data.news_id,
            content:data.content,
            status:data.status
        })
        if (comment) {
            message.code = responseCode.SUCCESS
            message.message = '创建成功'
            message.data = comment
        } else {
            message.code = responseCode.FAIL
            message.message = '创建失败'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}添加评论出错：`, err)
        throw err
    }
}
/**
 * 修改
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.update = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    try {
        if (data.id) {
            const user = await User.getUserById(data.user_id)
            if (!user) {
                message.code = responseCode.FAIL
                message.message = '关联用户不存在'
                ctx.body = message
                return ctx
            }
            const news = await News.getNewsById(data.news_id)
            if (!news) {
                message.code = responseCode.FAIL
                message.message = '关联新闻不存在'
                ctx.body = message
                return ctx
            }
            let comment = await Comment.getCommentById(data.id)
            if (!comment) {
                message.code = responseCode.FAIL
                message.message = '评论不存在'
                ctx.body = message
                return ctx
            }
            comment = await Comment.updateComment({
                user_id:data.user_id,
                news_id:data.news_id,
                content:data.content,
                status:data.status
            }, data.id)
            if (comment) {
                message.code = responseCode.SUCCESS
                message.message = '修改成功'
                message.data = await Comment.getCommentById(data.id)
            } else {
                message.code = responseCode.FAIL
                message.message = '修改失败'
            }
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}修改评论出错：`, err)
        throw err
    }
}
/**
 * 删除
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.delete = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    try {
        if (data.id) {
            const comment = await Comment.deleteComment(data.id)
            if (!comment) {
                message.code = responseCode.FAIL
                message.message = '删除失败'
                ctx.body = message
                return ctx
            }
            message.code = responseCode.SUCCESS
            message.message = '删除成功'
            message.data = comment
            ctx.body = message
            return ctx
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
        }
        ctx.body = ctx
        return ctx
    } catch (err) {
        console.log(`${errLog}删除评论出错：`, err)
        throw err
    }
}
/**
 * 获取
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.get = async(ctx) => {
    const data = Object.assign({}, ctx.params, ctx.query)
    const message = {}
    try {
        if (data.id) {
            const comment = await Comment.getCommentById(data.id)
            if (comment) {
                message.code = responseCode.SUCCESS
                message.message = '获取成功'
                message.data = comment
            } else {
                message.code = responseCode.FAIL
                message.message = '评论不存在'
            }
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}获取菜单出错：`, err)
        throw err
    }
}
/**
 * 列表
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.list = async(ctx) => {
    const data = ctx.query
    if (!data.page) data.page = 1
    if (!data.size) data.size = 10
    const where = {
        nickName:data.nickName,
        title:data.title,
        author:data.author,
        status:data.status,
        createdAt:data.createdAt
    }
    Object.keys(where).forEach((key) => {
        if (!where[key]) {
            delete where[key]
        }
    })
    const newsWhere = where.title ? { title:{ $like:`%${where.title}%` } } : {}
    delete where.title
    const userWhere = where.nickName ? { nickName:{ $like:`%${where.nickName}%` } } : {}
    delete where.nickName
    if (where.createdAt) {
        const _times = where.createdAt.split('|')
        where.createdAt = {
            $gte:_times[0],
            $lte:_times[1]
        }
    }
    const message = {}
    try {
        const comment = await Comment.getCommentList(
            where,
            parseInt(data.page) - 1,
            parseInt(data.size),
            newsWhere,
            userWhere
        )
        if (comment) {
            message.code = responseCode.SUCCESS
            message.message = '获取成功'
            comment.totalElement = comment.count
            comment.content = comment.rows
            delete comment.count
            delete comment.rows
            message.data = comment
        } else {
            message.code = responseCode.FAIL
            message.message = '获取失败'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}评论列表出错：`, err)
        throw err
    }
}
/**
 * 审核
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.review = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    try {
        if (data.id) {
            let comment = await Comment.getCommentById(data.id)
            if (!comment) {
                message.code = responseCode.FAIL
                message.message = '评论不存在'
                ctx.body = message
                return ctx
            }
            comment = await Comment.updateComment({ status:data.status }, data.id)
            if (!comment) {
                message.code = responseCode.FAIL
                message.message = '审核失败'
                ctx.body = message
                return ctx
            }
            message.code = responseCode.SUCCESS
            message.message = '审核成功'
            message.data = await Comment.getCommentById(data.id)
            ctx.body = message
            return ctx
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
            ctx.body = message
            return ctx
        }
    } catch (err) {
        console.log(`${errLog}评论审核出错：`, err)
        throw err
    }
}
