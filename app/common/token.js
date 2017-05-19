/**
 * Created by lxj on 2017/3/22.
 */
const jwt = require('jwt-simple')
const jwtTokenSecret = 'bf3f1d8eeae6ab319844eab323c56e54'
const responseCode = require('../common/responseCode')

/**
 * 生成token
 * @param _iss id
 * @param expires 时效
 * @returns {String}
 */
exports.getToken = (_iss, expires) => {
    return jwt.encode({
        iss: _iss,
        exp: expires
    }, jwtTokenSecret)
}

/**
 * 验证token
 * @param req
 * @param res
 * @param next
 */
exports.verifyToken = async(ctx, next) => {
    const data = ctx.request.body
    const message = {}
    const token = (data && data.authToken) || (ctx.query && ctx.query.authToken) || ctx.headers['authToken']
    if (token) {
        try {
            // 解密token
            const decoded = jwt.decode(token, jwtTokenSecret)
            if (decoded.exp <= Date.now()) {
                message.code = responseCode.AUTH_EXPIRED
                message.message = '登录超时'
                ctx.body = message
                return ctx
            }
            // 获取用户id
            ctx.uid = decoded.iss
        } catch (err) {
            message.code = responseCode.AUTH_EXPIRED
            message.message = '登录超时'
            ctx.body = message
            return ctx
        }
        await next()
    } else {
        message.code = responseCode.AUTH_EXPIRED
        message.message = '登录超时'
        ctx.body = message
        return ctx
    }
}