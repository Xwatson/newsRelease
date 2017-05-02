/**
 * Created by lxj on 2017/3/22.
 */
const responseCode = require('../common/responseCode')
const moment = require('moment')
const Admin = require('../proxy/admin')
const Auth = require('../proxy/auth')
const encipher = require('../common/encipher')
const token = require('../common/token')
const errLog = '管理员控制器：'

/**
 * 登录
 * @param ctx
 * @returns ctx
 */
exports.login = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    const adminInfo = await Admin.getAdminByName(data.name)
    if (!adminInfo) {
        message.code = responseCode.FAIL
        message.message = '账户不存在'
        ctx.body = message
        return ctx
    }
    if (encipher.getMd5(data.password) !== adminInfo.password) {
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
            if ((!adminInfo.dataValues.adminName || adminInfo.dataValues.adminName !== '') && adminInfo.dataValues.adminName === data.name) {
                message.code = responseCode.FAIL
                message.message = '账户已存在'
                ctx.body = message
                return ctx
            } else if ((!adminInfo.dataValues.email || adminInfo.dataValues.email !== '') && adminInfo.dataValues.email === data.email) {
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
        adminInfo = await Admin.create({
            adminName:data.name,
            email:data.email,
            auth_id:data.auth_id,
            password:encipher.getMd5(data.password),
            status:data.status
        })
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
            let admin = await Admin.getAdminByWhere({'$or':[{ adminName:data.name }, { email:data.email }] })
            if (admin) {
                if ((!admin.dataValues.adminName || admin.dataValues.adminName !== '') && admin.dataValues.adminName === data.name) {
                    message.code = responseCode.FAIL
                    message.message = '账户已存在'
                    ctx.body = message
                    return ctx
                } else if ((!admin.dataValues.email || admin.dataValues.email !== '') && admin.dataValues.email === data.email) {
                    message.code = responseCode.FAIL
                    message.message = '邮箱已被注册'
                    ctx.body = message
                    return ctx
                }
            }
            admin = await Admin.getAdminById(data.id)
            if (!admin) {
                message.code = responseCode.FAIL
                message.message = '管理员不存在'
                ctx.body = message
                return ctx
            }
            const newPwd = encipher.getMd5(data.new_password)
            if (admin.password !== newPwd) {
                message.code = responseCode.FAIL
                message.message = '原始密码错误'
                ctx.body = message
                return ctx
            }
            const auth = await Auth.getAuthById(data.auth_id)
            if (!auth) {
                message.code = responseCode.FAIL
                message.message = '关联权限不存在'
                ctx.body = message
                return ctx
            }
            await Admin.update({
                adminName:data.name,
                email:data.email,
                auth_id:data.auth_id,
                password:newPwd,
                status:data.status
            }, data.id)
            message.code = responseCode.SUCCESS
            message.message = '修改成功'
            message.data = admin
            ctx.body = message
            return ctx
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
            ctx.body = message
            return ctx
        }
    } catch (err) {
        console.log(`${errLog}修改管理员出错：`, err)
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
            let admin = await Admin.getAdminByIdNoAssociation(data.id)
            if (!admin) {
                message.code = responseCode.FAIL
                message.message = 'id不存在'
                ctx.body = message
                return ctx
            }
            await Admin.delete(data.id)
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
            const admin = await Admin.getAdminById(data.id)
            if (admin) {
                message.code = responseCode.SUCCESS
                message.message = '获取成功'
                message.data = admin
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
        console.log(`${errLog}获取管理员出错：`, err)
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
        const admin = await Admin.getAdminList(parseInt(data.page) - 1, parseInt(data.size), {})
        if (admin) {
            message.code = responseCode.SUCCESS
            message.message = '获取成功'
            admin.totalElement = admin.count
            admin.content = admin.rows
            delete admin.count
            delete admin.rows
            message.data = admin
        } else {
            message.code = responseCode.FAIL
            message.message = '获取失败'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}管理员列表出错：`, err)
        throw err
    }
}
