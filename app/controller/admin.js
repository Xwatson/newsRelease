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
    const data = ctx.body
    const message = {}
    try {
        let adminInfo = await Admin.getAdminByName(data.name)
        if (adminInfo) {
            message.code = responseCode.FAIL
            message.message = '账户已存在'
        }
        adminInfo = await Admin.getAdminByEmail(data.email)
        if (adminInfo) {
            message.code = responseCode.FAIL
            message.message = '邮箱已被注册'
        }
        const auth = await Auth.getAuthById(data.auth_id)
        if (!auth) {
            const _admin = {
                adminName:data.name,
                email:data.email,
                password:encipher.getMd5(data.password),
                status:data.status
            }
            adminInfo = await Admin.createAdmin(_admin)
            if (adminInfo) {
                adminInfo = await Admin.createAuth(auth)
                if (!adminInfo) {
                    // 获取创建成功用户
                    adminInfo = await Admin.getAdminByEmail(data.email)
                    if (adminInfo) {
                        message.code = responseCode.SUCCESS
                        message.message = '注册成功'
                        message.data = adminInfo
                    }
                } else {
                    message.code = responseCode.FAIL
                    message.message = '关联权限出错'
                }
            } else {
                message.code = responseCode.FAIL
                message.message = '创建用户出错'
            }
        } else {
            message.code = responseCode.FAIL
            message.message = '关联权限不存在'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(err)
        throw (err)
    }
}