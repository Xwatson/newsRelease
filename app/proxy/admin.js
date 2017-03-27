/**
 * Created by xuwus on 2017/3/22.
 */
const Admin = require('../models/admin')

/**
 * 根据用户名获取用户
 * @returns {Promise.<void>}
 */
exports.getAdminByName = async(name) => {
    return await Admin.findOne({
        where: {
            adminName: name
        }
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
