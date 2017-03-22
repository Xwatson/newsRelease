/**
 * Created by xuwus on 2017/3/22.
 */
const crypto = require('crypto');

/**
 *
 * @param str 要做加密的字符串
 * @returns {*}返回16进制的哈希值
 */
exports.getMd5 = (str)=> {
    return crypto.createHash('md5').update(str).digest('hex');
};