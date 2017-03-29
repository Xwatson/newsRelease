/**
 * Created by xuwus on 2017/3/22.
 */
const moment = require('moment')
const Admin = require('../proxy/admin')
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
        message.code = -1
        message.message = '账户不存在'
        ctx.body = message
        return ctx
    }
    if (data.password !== encipher.getMd5(adminInfo.password)) {
        message.code = -1
        message.message = '密码错误'
        ctx.body = message
        return ctx
    }
    // 过期时间
    const expires = moment().add(7,'days').valueOf()
    message.code = 1
    message.message = '登录成功'
    message.data = {
        id:adminInfo.id,
        adminName:adminInfo.adminName,
        email:adminInfo.email,
        auth:adminInfo.auth_id,
        expireTime:expires,
        token:token.getToken(adminInfo.id, expires)
    }
    ctx.body = message
    return ctx
}
/**
 * 创建用户
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.create = async(ctx) => {
    const data = ctx.body
    const message = {}
    try {
        let adminInfo = await Admin.getAdminByName(data.name)
        if (adminInfo) {
            message.code = -1
            message.message = '账户已存在'
        }
        adminInfo = await Admin.getAdminByEmail(data.email)
        if (adminInfo) {
            message.code = -1
            message.message = '邮箱已被注册'
        }
        const _admin = {
            adminName:data.name,
            email:data.email,
            password:data.password,
            status:data.status
        }
        await Admin.createAdmin(_admin)
        // 获取创建成功用户
        adminInfo = await Admin.getAdminByEmail(data.email)
        // 权限
        if (adminInfo) {
            message.code = 1
            message.message = '注册成功'
            message.data = adminInfo
        }
        ctx.body = message
    }catch (err) {
        console.log(err)
        throw (err)
    }
}