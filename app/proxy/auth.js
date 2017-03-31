/**
 * Created by xwatson on 2017/3/29.
 */
const Auth = require('../models/auth')
const Menu = require('./menu')
const Operation = require('../models/operation')

/**
 * 创建权限
 * @param auth
 * @returns {Promise.<void>}
 */
exports.create = async(auth, menuId, operationId) => {
    let authInfo = null
    try {
        authInfo = await Auth.create(auth)
        if (authInfo) {
            const menu = Menu.
        }
    }catch (err) {
        console.log(err)
        throw err
    }
}
