/**
 * Created by xwatson on 2017/4/2.
 */
const responseCode = require('../common/responseCode')
const Auth = require('../proxy/auth')
const Admin = require('../proxy/admin')
const Menu = require('../proxy/menu')
const Operation = require('../proxy/operation')
const AuthOperation = require('../models/authOperation')
const errLog = '权限控制器：'

const dealWithAuth = (authOperation, authMenu) => {
    if (authOperation && authOperation.length) {
        authOperation.map((item) => {
            delete item.dataValues.xj_authOperation
        })
    }
    if (authMenu && authMenu.length) {
        authMenu.map((item) => {
            delete item.dataValues.xj_authMenu
        })
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
        let auth = await Auth.getAuthByName(data.name)
        if (!auth.length) {
            const menus = await Menu.getMenuByWhere({ id:data.menu_ids.split(',') })
            const operations = await Operation.getOperationsByWhere({ id:data.operation_ids.split(',') })
            auth = await Auth.create({
                name:data.name,
                status:data.status
            }, menus, operations)
            if (!auth) {
                message.code = responseCode.FAIL
                message.message = '创建失败'
                ctx.body = message
                return ctx
            }
            message.code = responseCode.SUCCESS
            message.message = '创建成功'
            message.data = auth
            ctx.body = message
            return ctx
        } else {
            message.code = responseCode.FAIL
            message.message = '菜单名称已存在'
            ctx.body = message
            return ctx
        }
    } catch (err) {
        console.log(`${errLog}添加权限出错：`, err)
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
        if (!data.id) {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
            ctx.body = message
            return ctx
        }
        let auth = await Auth.getAuthById(data.id)
        if (!auth) {
            message.code = responseCode.FAIL
            message.message = '该id不存在'
            ctx.body = message
            return ctx
        }
        const menus = await Menu.getMenuByWhere({ id:data.menu_ids.split(',') })
        const operations = await Operation.getOperationsByWhere({ id:data.operation_ids.split(',') })
        auth = await Auth.update({ name:data.name, status:data.status }, menus, operations, data.id, auth)
        if (!auth) {
            message.code = responseCode.FAIL
            message.message = '修改失败'
            ctx.body = message
            return ctx
        }
        message.code = responseCode.SUCCESS
        message.message = '修改成功'
        message.data = auth
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}修改权限出错：`, err)
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
        let auth = await Auth.getAssociationAuthById(data.id)
        if (!auth) {
            message.code = responseCode.FAIL
            message.message = 'id不存在'
            ctx.body = message
            return ctx
        }
        await auth.setAuthOperation([])
        await auth.setAuthMenu([])
        auth = await auth.destroy()
        message.code = responseCode.SUCCESS
        message.message = '删除成功'
        message.data = auth
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}删除权限出错：`, err)
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
            const auth = await Auth.getAuthById(data.id)
            dealWithAuth(auth.dataValues.AuthOperation, auth.dataValues.AuthMenu)
            if (auth) {
                message.code = responseCode.SUCCESS
                message.message = '获取成功'
                message.data = auth
            } else {
                message.code = responseCode.FAIL
                message.message = '该权限不存在'
            }
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}获取权限出错：`, err)
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
        const auth = await Auth.getAuthList(parseInt(data.page) - 1, parseInt(data.size), {})
        if (auth && auth.rows.length) {
            auth.rows.map((item) => {
                dealWithAuth(item.dataValues.AuthOperation, item.dataValues.AuthMenu)
            })
        }
        /*const authOperation = await auth.getAuthOperation()
        const authMenu = await auth.getAuthMenu()
        dealWithAuth(authOperation, authMenu)*/
        if (auth) {
            message.code = responseCode.SUCCESS
            message.message = '获取成功'
            auth.totalElement = auth.count
            auth.content = auth.rows
            delete auth.count
            delete auth.rows
            message.data = auth
        } else {
            message.code = responseCode.FAIL
            message.message = '获取失败'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}权限列表出错：`, err)
        throw err
    }
}
