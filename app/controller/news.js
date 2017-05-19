/**
 * Created by lxj on 2017/4/24.
 */
const responseCode = require('../common/responseCode')
const moment = require('moment')
const News = require('../proxy/news')
const Category = require('../proxy/category')
const upload = require('./upload')
const uEditorConfig = require('../../config/uEditor.json')
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
            message.message = '关联分类不存在'
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
            source:data.source,
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
        console.log(`${errLog}创建新闻出错：`, err)
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
            if (!category) {
                message.code = responseCode.FAIL
                message.message = '分类不不存在'
                ctx.body = message
                return ctx
            }
            let news = await News.getNewsById(data.id)
            if (!news) {
                message.code = responseCode.FAIL
                message.message = '新闻不存在'
                ctx.body = message
                return ctx
            }
            news = await News.updateNews({
                title:data.title,
                keyWords:data.keyWords,
                summary:data.summary,
                categoryId:data.category_id,
                content:data.content,
                thumbnailPic:data.thumbnailPic,
                carouselPic:data.carouselPic,
                is_carousel:data.is_carousel,
                author:data.author,
                source:data.source,
                // accessCount:data.accessCount,
                status:data.status
            }, data.id)
            message.code = responseCode.SUCCESS
            message.message = '修改成功'
            message.data = await News.getNewsById(data.id)
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
    const data = Object.assign({}, ctx.params, ctx.query)
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
    const where = {
        title:data.title,
        category_id:data.category_id,
        author:data.author,
        status:data.status,
        createdAt:data.createdAt
    }
    Object.keys(where).forEach((key) => {
        if (!where[key]) {
            delete where[key]
        }
    })
    if (where.createdAt) {
        const _times = where.createdAt.split('|')
        where.createdAt = {
            $gte:_times[0],
            $lte:_times[1]
        }
    }
    if (where.title) {
        where.title = { $like:`%${where.title}%` }
    }
    const message = {}
    try {
        const news = await News.getNewsList(where, parseInt(data.page) - 1, parseInt(data.size))
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

/**
 * 上传
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.upload = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    const file = await upload.upload(data.file, 'uploads/news/')
    if (!file) {
        message.code = responseCode.FAIL
        message.message = '上传失败'
        ctx.body = message
        return ctx
    }
    message.code = responseCode.SUCCESS
    message.message = '上传成功'
    message.data = file
    ctx.body = message
    return ctx
}
/**
 * 富文本上传
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.editorUpload = async(ctx) => {
    const query = ctx.query
    const data = ctx.request.body || ctx.query
    const message = {}
    switch (query.action) {
        case 'config':
            ctx.body = `${query.callback}(${JSON.stringify(uEditorConfig)})`
            return ctx
        case 'uploadimage':
            const file = await upload.upload(data.file, 'uploads/editor/')
            if (!file) {
                message.code = responseCode.FAIL
                message.message = '上传失败'
                ctx.body = message
                return ctx
            }
            ctx.body = {
                "state": "SUCCESS",
                "url": file.path,
                "title": file.name,
                "original": file.name,
            }
            return ctx
    }
}