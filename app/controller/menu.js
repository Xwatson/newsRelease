/**
 * Created by xwatson on 2017/4/2.
 */
const responseCode = require('../common/responseCode')
const Menu = require('../proxy/menu')
const errLog = '菜单控制器：'

/**
 * 创建
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.create = async(ctx) => {
    const data = ctx.body
    const message = {}
    try {
        let menu = await Menu.getMenuByName(data.name)
        if (!menu) {
            menu = await Menu.create({
                name:data.name,
                router:data.router,
                icon:data.icon,
                sort:Menu.max('sort', { where:{ parent_id:data.parent_id || 0 } }),
                parent_id:data.parent_id || 0
            })
            if (menu) {
                message.code = responseCode.SUCCESS
                message.message = '创建成功'
            } else {
                message.code = responseCode.FAIL
                message.message = '创建失败'
            }
        } else {
            message.code = responseCode.FAIL
            message.message = '菜单名称已存在'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}添加菜单出错：`, err)
        throw err
    }
}
/**
 * 修改
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.update = async(ctx) => {
    const data = ctx.body
    const message = {}
    try {
        if (data.id) {
            const meun = await Menu.update({
                name:data.name,
                router:data.router,
                icon:data.icon,
                // sort:Menu.max('sort', { where:{ parent_id:data.parent_id || 0 } }), 不修改菜单
                parent_id:data.parent_id || 0
            }, data.id)
            if (meun) {
                message.code = responseCode.SUCCESS
                message.message = '修改成功'
                message.data = meun
            } else {
                message.code = responseCode.FAIL
                message.message = '修改失败'
            }
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
        }
    } catch (err) {
        console.log(`${errLog}修改菜单出错：`, err)
        throw err
    }
}
/**
 * 删除
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.delete = async(ctx) => {
    const data = ctx.body
    const message = {}
    try {
        if (data.id) {
            const menu = await Menu.delete(data.id)
            if (menu) {
                message.code = responseCode.SUCCESS
                message.message = '删除成功'
                message.data = menu
            } else {
                message.code = responseCode.FAIL
                message.message = '删除失败'
            }
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
        }
        ctx.body = ctx
        return ctx
    } catch (err) {
        console.log(`${errLog}删除菜单出错：`, err)
        throw err
    }
}
/**
 * 获取
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.get = async(ctx) => {
    const data = ctx.body
    const message = {}
    try {
        if (data.id) {
            const menu = await Menu.getMenuById(data.id)
            if (menu) {
                message.code = responseCode.SUCCESS
                message.message = '获取成功'
                message.data = menu
            } else {
                message.code = responseCode.FAIL
                message.message = '该菜单不存在'
            }
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
        }
        ctx.body = ctx
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
    const data = ctx.body
    const message = {}
    try {
        const menu = await Menu.getMenus({})
        if (menu) {
            message.code = responseCode.SUCCESS
            message.message = '获取成功'
            message.data = menu
        } else {
            message.code = responseCode.FAIL
            message.message = '获取失败'
        }
        ctx.body = ctx
        return ctx
    } catch (err) {
        console.log(`${errLog}菜单列表出错：`, err)
        throw err
    }
}
