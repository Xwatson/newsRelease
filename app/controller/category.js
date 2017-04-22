/**
 * Created by xwatson on 2017/4/22.
 */
const responseCode = require('../common/responseCode')
const Category = require('../proxy/category')
const errLog = '菜单控制器：'

/**
 * 创建
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.create = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    try {
        let category = await Category.getCategoryByName(data.name)
        if (category) {
            message.code = responseCode.FAIL
            message.message = '菜单名称已存在'
            ctx.body = message
            return ctx
        }
        const max = await Category.max('sort', { where:{ parent_id:data.parent_id || 0 } })
        category = await Category.createCategory({
            name:data.name,
            is_nav:data.is_nav,
            sort:max || 0,
            parent_id:data.parent_id || 0,
            status:data.status
        })
        if (category) {
            category = await Menu.getMenuByName(data.name)
            message.code = responseCode.SUCCESS
            message.message = '创建成功'
            message.data = category
        } else {
            message.code = responseCode.FAIL
            message.message = '创建失败'
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
    const data = ctx.request.body
    const message = {}
    try {
        if (data.id) {
            const meun = await Menu.update({
                name:data.name,
                router:data.router,
                icon:data.icon,
                // sort:Menu.max('sort', { where:{ parent_id:data.parent_id || 0 } }), 不修改排序
                parent_id:data.parent_id || 0
            }, data.id)
            if (meun) {
                message.code = responseCode.SUCCESS
                message.message = '修改成功'
                message.data = await Menu.getMenuById(data.id)
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
    const data = ctx.request.body
    const message = {}
    try {
        if (data.id) {
            let menu = await Menu.getMenuById(data.id)
            if (!menu) {
                message.code = responseCode.FAIL
                message.message = 'id不存在'
                ctx.body = message
                return ctx
            }
            const authMenu = await menu.getAuthMenu()
            if (authMenu.length) {
                message.code = responseCode.FAIL
                message.message = '该操菜单已被关联'
                ctx.body = message
                return ctx
            }
            menu = await Menu.delete(data.id)
            if (!menu) {
                message.code = responseCode.FAIL
                message.message = '删除失败'
                ctx.body = message
                return ctx
            }
            message.code = responseCode.SUCCESS
            message.message = '删除成功'
            message.data = menu
            ctx.body = message
            return ctx
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
    const data = ctx.query
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
    const message = {}
    try {
        const menu = await Menu.getMenus({}, parseInt(data.page) - 1, parseInt(data.size))
        if (menu) {
            message.code = responseCode.SUCCESS
            message.message = '获取成功'
            menu.totalElement = menu.count
            menu.content = menu.rows
            delete menu.count
            delete menu.rows
            message.data = menu
        } else {
            message.code = responseCode.FAIL
            message.message = '获取失败'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}菜单列表出错：`, err)
        throw err
    }
}
