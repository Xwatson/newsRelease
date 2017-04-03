/**
 * Created by xuwus on 2017/3/22.
 */
const jwt = require('jwt-simple')
const jwtTokenSecret = Symbol('NEWS_RELEASE_LOVE_LXJ_TOKEN')
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
    console.log('验证token ', ctx.request)
    const message = {}
    const token = (ctx.body && ctx.body.authToken) || (ctx.query && ctx.query.authToken) || ctx.headers['authToken']
    if (token) {
        try {
            var decoded = jwt.decode(token, jwtTokenSecret)
            if (decoded.exp <= Date.now()) {
                message.code = responseCode.AUTH_EXPIRED
                message.message = '登录超时'
                ctx.body = message
                return ctx
            }
            req.uid = decoded.iss
        } catch (err) {
            message.code = responseCode.AUTH_EXPIRED
            message.message = '登录超时'
            ctx.body = message
        }
        next()
    } else {
        message.code = responseCode.AUTH_EXPIRED
        message.message = '登录超时'
        ctx.body = message
        return ctx
    }
}