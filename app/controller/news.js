/**
 * Created by xuwus on 2017/4/24.
 */
const responseCode = require('../common/responseCode')
const moment = require('moment')
const News = require('../proxy/news')
const Category = require('../proxy/category')
const errLog = '管理员控制器：'

/**
 * 创建
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.create = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    try {
        const category = await Category.getCategoryById(data.category_id)
        if (!category) {
            message.code = responseCode.FAIL
            message.message = '关联权限不存在'
            ctx.body = message
            return ctx
        }
        const news = await News.createNews({
            title:data.title,
            keyWords:data.keyWords,
            summary:data.summary,
            categoryId:data.category_id,
            content:data.content,
            thumbnailPic:data.thumbnailPic,
            carouselPic:data.carouselPic,
            is_carousel:data.is_carousel,
            author:data.author,
            accessCount:1,
            status:data.status
        })
        if (!news) {
            message.code = responseCode.FAIL
            message.message = '创建新闻失败'
            ctx.body = message
            return ctx
        }
        message.code = responseCode.SUCCESS
        message.message = '创建成功'
        message.data = news
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}创建管理员出错：`, err)
        throw (err)
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
            const category = await Category.getCategoryById(data.category_id)
            if (category) {
                message.code = responseCode.FAIL
                message.message = '分类不不存在'
                ctx.body = message
                return ctx
            }
            const news = await News.updateNews({
                title:data.title,
                keyWords:data.keyWords,
                summary:data.summary,
                categoryId:data.category_id,
                content:data.content,
                thumbnailPic:data.thumbnailPic,
                carouselPic:data.carouselPic,
                is_carousel:data.is_carousel,
                author:data.author,
                // accessCount:data.accessCount,
                status:data.status
            }, data.id)
            message.code = responseCode.SUCCESS
            message.message = '修改成功'
            message.data = news
            ctx.body = message
            return ctx
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
            ctx.body = message
            return ctx
        }
    } catch (err) {
        console.log(`${errLog}修改新闻出错：`, err)
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
            let news = await News.getNewsById(data.id)
            if (!news) {
                message.code = responseCode.FAIL
                message.message = 'id不存在'
                ctx.body = message
                return ctx
            }
            await News.deleteNews(data.id)
            message.code = responseCode.SUCCESS
            message.message = '删除成功'
            ctx.body = message
            return ctx
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
        }
        ctx.body = ctx
        return ctx
    } catch (err) {
        console.log(`${errLog}删除管理员出错：`, err)
        throw err
    }
}
/**
 * 获取
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.get = async(ctx) => {
    const data = ctx.query
    const message = {}
    try {
        if (data.id) {
            const news = await News.getNewsById(data.id)
            if (news) {
                message.code = responseCode.SUCCESS
                message.message = '获取成功'
                message.data = news
            } else {
                message.code = responseCode.FAIL
                message.message = '该用户不存在'
            }
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}获取新闻出错：`, err)
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
    const message = {}
    try {
        const news = await News.getNewsList({}, parseInt(data.page) - 1, parseInt(data.size))
        if (news) {
            message.code = responseCode.SUCCESS
            message.message = '获取成功'
            news.totalElement = news.count
            news.content = news.rows
            delete news.count
            delete news.rows
            message.data = news
        } else {
            message.code = responseCode.FAIL
            message.message = '获取失败'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}新闻列表出错：`, err)
        throw err
    }
}
