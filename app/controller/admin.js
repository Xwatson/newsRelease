/**
 * Created by xuwus on 2017/3/22.
 */
const responseCode = require('../common/responseCode')
const moment = require('moment')
const Admin = require('../proxy/admin')
const Auth = require('../proxy/auth')
const encipher = require('../common/encipher')
const token = require('../common/token')

/**
 * 登录
 * @param ctx
 * @returns ctx
 */
exports.login = async(ctx) => {
    const data = ctx.body
    const message = {}
    const adminInfo = await Admin.getAdminByName(data.name)
    if (!adminInfo) {
        message.code = responseCode.FAIL
        message.message = '账户不存在'
        ctx.body = message
        return ctx
    }
    if (data.password !== encipher.getMd5(adminInfo.password)) {
        message.code = responseCode.FAIL
        message.message = '密码错误'
        ctx.body = message
        return ctx
    }
    // 过期时间
    const expires = moment().add(7,'days').valueOf()
    message.code = responseCode.SUCCESS
    message.message = '登录成功'
    adminInfo.token = token.getToken(adminInfo.id, expires)
    message.data = adminInfo
    ctx.body = message
    return ctx
}
/**
 * 创建用户
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.create = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    try {
        let adminInfo = await Admin.getAdminByWhere({'$or':[{ adminName:data.name }, { email:data.email }] })
        if (adminInfo) {
            if (!adminInfo.dataValues.adminName || adminInfo.dataValues.adminName !== '') {
                message.code = responseCode.FAIL
                message.message = '账户已存在'
                ctx.body = message
                return ctx
            } else if (!adminInfo.dataValues.email || adminInfo.dataValues.email !== '') {
                message.code = responseCode.FAIL
                message.message = '邮箱已被注册'
                ctx.body = message
                return ctx
            }
        }
        const auth = await Auth.getAuthById(data.auth_id)
        if (!auth) {
            message.code = responseCode.FAIL
            message.message = '关联权限不存在'
            ctx.body = message
            return ctx
        }
        adminInfo = await Admin.createAdmin({
            adminName:data.name,
            email:data.email,
            auth_id:data.auth_id,
            password:encipher.getMd5(data.password),
            status:data.status
        }, auth)
        if (!adminInfo) {
            message.code = responseCode.FAIL
            message.message = '创建用户失败'
            ctx.body = message
            return ctx
        }
        message.code = responseCode.SUCCESS
        message.message = '注册成功'
        adminInfo.dataValues.auth = auth
        message.data = adminInfo
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(err)
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
        const menu = await Menu.getMenus({}, data.page - 1, data.size)
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
