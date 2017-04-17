/**
 * Created by xwatson on 2017/4/2.
 */
const responseCode = require('../common/responseCode')
const Auth = require('../proxy/auth')
const Admin = require('../proxy/admin')
const Operation = require('../proxy/operation')
const errLog = '权限控制器：'

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
        if (!auth) {
            auth = await Auth.create({
                name:data.name,
                menu_ids:data.menu_ids,
                menu_names:data.menu_names,
                status:data.status
            })
            message.code = responseCode.SUCCESS
            message.message = '创建成功'
            message.data = auth
        } else {
            message.code = responseCode.FAIL
            message.message = '菜单名称已存在'
        }
        ctx.body = message
        return ctx
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
    const data = ctx.body
    const message = {}
    try {
        if (data.id) {
            const operation = await Operation.getOperationsByWhere({ id:JSON.parse(data.ids) })
            if (operation) {
                let auth = await Auth.update({
                    name:data.name,
                    menu_ids:data.menu_ids,
                    menu_names:data.menu_names,
                    status:data.status
                }, data.id)
                if (auth) {
                    auth = auth.setOperations(operation)
                    if (auth) {
                        message.code = responseCode.SUCCESS
                        message.message = '修改成功'
                        message.data = auth
                    } else {
                        message.code = responseCode.FAIL
                        message.message = '修改菜单成功，操作项关联失败'
                    }
                } else {
                    message.code = responseCode.FAIL
                    message.message = '修改失败'
                }
            } else {
                message.code = responseCode.FAIL
                message.message = '操作项不存在'
            }
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
        }
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
    const data = ctx.body
    const message = {}
    try {
        const authAdmin = await Admin.getAuthById(data.id)
        if (!authAdmin) {
            const auth = await Auth.delete(data.id)
            if (auth) {
                message.code = responseCode.SUCCESS
                message.message = '删除成功'
                message.data = auth
            } else {
                message.code = responseCode.FAIL
                message.message = '删除失败'
            }
        } else {
            message.code = responseCode.FAIL
            message.message = '该权限已被关联'
        }
        ctx.body = ctx
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
    const data = ctx.body
    const message = {}
    try {
        if (data.id) {
            const auth = await Auth.getAuthById(data.id)
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
        ctx.body = ctx
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
    const data = ctx.body
    const message = {}
    try {
        const auth = await Auth.getAuthByWhere({})
        if (auth) {
            message.code = responseCode.SUCCESS
            message.message = '获取成功'
            message.data = auth
        } else {
            message.code = responseCode.FAIL
            message.message = '获取失败'
        }
        ctx.body = ctx
        return ctx
    } catch (err) {
        console.log(`${errLog}权限列表出错：`, err)
        throw err
    }
}
