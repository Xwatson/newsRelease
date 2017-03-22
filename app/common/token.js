/**
 * Created by xuwus on 2017/3/22.
 */
const jwt = require('jwt-simple')
var jwtTokenSecret = Symbol('NEWS_RELEASE_LOVE_LXJ_TOKEN')

module.exports.getToken = (_iss, expires) => {
    return jwt.encode({
        iss: _iss,
        exp: expires
    }, jwtTokenSecret)
}