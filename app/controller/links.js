/**
 * Created by lxj on 2017/4/22.
 */
const responseCode = require('../common/responseCode')
const Operation = require('../proxy/operation')
const Links = require('../proxy/links')
const upload = require('./upload')
const errLog = '外链控制器：'

/**
 * 获取
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.get = async(ctx) => {
    const data = Object.assign({}, ctx.params, ctx.query)
    const message = {}
    try {
        const links = await Links.getLinksById(data.id)
        if (links) {
            message.code = responseCode.SUCCESS
            message.message = '获取成功'
            message.data = links
        } else {
            message.code = responseCode.FAIL
            message.message = '该操作不存在'
        }
        ctx.body = message
        return ctx
    }catch (err) {
        console.log(`${errLog}获取出错：`, err)
        throw err
    }
}
/**
 * 获取列表
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.list = async(ctx) => {
    const data = ctx.query
    if (!data.page) data.page = 1
    if (!data.size) data.size = 10
    const message = {}
    try {
        const links = await Links.getLinksList({}, parseInt(data.page) - 1, parseInt(data.size))
        if (links) {
            message.code = responseCode.SUCCESS
            message.message = '获取成功'
            links.totalElement = links.count
            links.content = links.rows
            delete links.count
            delete links.rows
            message.data = links
        } else {
            message.code = responseCode.FAIL
            message.message = '获取失败'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}获外链表出错：`, err)
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
        let links = await Links.getLinksByName(data.name)
        if (links) {
            message.code = responseCode.FAIL
            message.message = '该外链已存在'
            ctx.body = message
            return ctx
        }
        const max = await Links.max('sort', {})
        links = await Links.createLinks({ name:data.name, url:data.url, icon:data.icon, sort:isNaN(max) ? 0 : max, status:data.status })
        if (!links) {
            message.code = responseCode.FAIL
            message.message = '创建失败'
            ctx.body = message
            return ctx
        }
        links = await Links.getLinksByName(data.name)
        message.code = responseCode.SUCCESS
        message.message = '创建成功'
        message.data = links
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}创建外链出错：`, err)
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
            let links = await Links.getLinksById(data.id)
            if (!links) {
                message.code = responseCode.FAIL
                message.message = 'id不存在'
                ctx.body = message
                return ctx
            }
            links = await Links.updateLinks({ name:data.name, url:data.url, icon:data.icon }, data.id)
            if (!links) {
                message.code = responseCode.FAIL
                message.message = '修改失败'
            }
            links = await Links.getLinksById(data.id)
            message.code = responseCode.SUCCESS
            message.message = '修改成功'
            message.data = links
            ctx.body = message
            return ctx
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}修改外链出错：`, err)
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
        const links = await Links.getLinksById(data.id)
        if (links) {
            const links = await Links.deleteLinks(data.id)
            if (links) {
                message.code = responseCode.SUCCESS
                message.message = '删除成功'
                message.data = links
            } else {
                message.code = responseCode.FAIL
                message.message = '删除失败'
            }
        } else {
            message.code = responseCode.FAIL
            message.message = 'id不存在'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}删除操作项出错：`, err)
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
    const file = await upload.upload(data.file, 'uploads/links/')
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