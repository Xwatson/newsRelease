/**
 * Created by xuwus on 2017/3/22.
 */
const Admin = require('../models/admin')
const Auth = require('../models/auth')

/**
 * 根据用户名获取用户
 * @returns {Promise.<void>}
 */
exports.getAdminByName = async(name) => {
    return await Admin.findOne({
        where: {
            adminName: name
        }
    },{
        'include': [Auth]
    })
}
/**
 * 根据邮箱获取用户
 * @returns {Promise.<void>}
 */
exports.getAdminByEmail = async(email) => {
    return await Admin.findOne({
        where: {
            email: email
        }
    },{
        'include': [Auth]
    })
}
/**
 * 根据id获取用户
 * @returns {Promise.<void>}
 */
exports.getAdminById = async(id) => {
    return await Admin.findOne({
        where: {
            id: id
        }
    },{
        'include': [Auth]
    })
}
/**
 * 创建
 * @param admin
 * @returns {Promise.<admin>}
 */
exports.createAdmin = async(admin) => {
    return await Admin.create(admin)
}
/**
 * 根据权限id获权限关联
 * @param id
 * @returns {Promise.<void>}
 */
exports.getAuthById = async(id) => {
    return await Auth.getAuth({ where:{ id:id } })
}