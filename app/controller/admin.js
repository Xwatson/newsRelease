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
    const bodyData = ctx.body
    const message = {}
    message.result = false
    const adminInfo = await Admin.getAdminByName(bodyData.name)
    if (!adminInfo) {
        message.code = -1
        message.message = '账户不存在'
        ctx.body = message
        return ctx
    }
    if (bodyData.password !== encipher.getMd5(adminInfo.password)) {
        message.code = -1
        message.message = '密码错误'
        ctx.body = message
        return ctx
    }
    // 过期时间
    var expires = moment().add(7,'days').valueOf()
    message.code = 1
    message.message = '登录成功'
    message.data = {
        id:adminInfo.id,
        adminName:adminInfo.adminName,
        email:adminInfo.email,
        auth:adminInfo.auth_id,
        token:token.getToken(adminInfo.id, expires)
    }
    ctx.body = message
    return ctx
}