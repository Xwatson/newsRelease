/**
 * Created by xuwus on 2017/3/22.
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
    let adminInfo = await Admin.getAdminByWhere({ adminName:data.name, status:'ENABLED' })
    if (!adminInfo) {
        message.code = responseCode.FAIL
        message.message = '账户不存在'
        ctx.body = message
        return ctx
    }
    adminInfo = adminInfo[0]
    if (encipher.getMd5(data.password) !== adminInfo.dataValues.password) {
        message.code = responseCode.FAIL
        message.message = '密码错误'
        ctx.body = message
        return ctx
    }
    // 过期时间
    const expires = moment().add(7,'days').valueOf()
    message.code = responseCode.SUCCESS
    message.message = '登录成功'
    adminInfo.dataValues.authToken = token.getToken(adminInfo.id, expires)
    adminInfo.dataValues.expireTime = expires
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
        let adminInfo = await Admin.getAdminByWhere({'$or':[{ adminName:data.adminName }, { email:data.email }] })[0]
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
            adminName:data.adminName,
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
            let getAdmin = await Admin.getAdminById(data.id)
            if (!getAdmin) {
                message.code = responseCode.FAIL
                message.message = '管理员不存在'
                ctx.body = message
                return ctx
            }
            if (getAdmin.dataValues.adminName !== data.adminName) {
                let admin = await Admin.getAdminByWhere({ adminName:data.adminName })//{'$or':[{ adminName:data.name }, { email:data.email }] })
                if (admin.length) {
                    message.code = responseCode.FAIL
                    message.message = '账户已存在'
                    ctx.body = message
                    return ctx
                }
            }
            if (getAdmin.dataValues.email !== data.email) {
                let admin2 = await Admin.getAdminByWhere({ email:data.email })
                if (admin2) {
                    message.code = responseCode.FAIL
                    message.message = '邮箱已被注册'
                    ctx.body = message
                    return ctx
                }
            }
            let isUpdatePwd = false
            if (data.password) {
                isUpdatePwd = true
                const password = encipher.getMd5(data.password)
                if (getAdmin.dataValues.password !== password) {
                    message.code = responseCode.FAIL
                    message.message = '原始密码错误'
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
            await Admin.update({
                adminName:data.adminName,
                email:data.email,
                auth_id:data.auth_id,
                password:isUpdatePwd ? encipher.getMd5(data.new_password) : getAdmin.dataValues.password,
                status:data.status
            }, data.id)
            getAdmin = await Admin.getAdminById(data.id)
            message.code = responseCode.SUCCESS
            message.message = '修改成功'
            message.data = getAdmin
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
            if (admin.dataValues.adminName === 'admin') {
                message.code = responseCode.FAIL
                message.message = '超级管理员不可删除'
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
    const data = Object.assign({}, ctx.params, ctx.query)
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
    const where = {
        adminName:data.adminName,
        email:data.email,
        auth_id:data.auth_id,
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
    if (where.adminName) {
        where.adminName = { $like:`%${where.adminName}%` }
    }
    if (where.email) {
        where.email = { $like:`%${where.email}%` }
    }
    const message = {}
    try {
        const admin = await Admin.getAdminList(parseInt(data.page) - 1, parseInt(data.size), where)
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
