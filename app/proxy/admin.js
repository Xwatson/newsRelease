/**
 * Created by lxj on 2017/3/22.
 */
const Admin = require('../models/admin')
const Auth = require('../models/auth')
const sequelize = require("../models/sequelize")

/**
 * 根据用户名获取用户
 * @returns {Promise.<void>}
 */
exports.getAdminByName = async(name) => {
    return await Admin.findOne({
        'include': [ { model: Auth, as:'Auth'}],
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
        'include': [ { model: Auth, required: true, as:'Auth'}]
    }, {
        where: {
            email: email
        }
    })
}
/**
 * 根据邮箱获取用户
 * @returns {Promise.<void>}
 */
exports.getAdminByWhere = async(where) => {
    return await Admin.findOne({
        'include': [ { model: Auth, required: true, as:'Auth'}]
    },{
        where: where
    })
}
/**
 * 根据id获取用户
 * @returns {Promise.<void>}
 */
exports.getAdminById = async(id) => {
    return await Admin.findOne({
        'include': [ { model: Auth, required: true, as:'Auth'}]
    }, {
        where: {
            id: id
        }
    })
}
/**
 * 根据id获取用户(非关联)
 * @returns {Promise.<void>}
 */
exports.getAdminByIdNoAssociation = async(id) => {
    return await Admin.findById(id)
}
/**
 * 创建
 * @param admin
 * @returns {Promise.<admin>}
 */
exports.create = async(admin) => {
    return await Admin.create(admin)
}
/**
 * 修改
 * @param admin
 * @param id
 * @returns {Promise.<admin>}
 */
exports.update = async(admin, id) => {
    return await Admin.update(admin, { where: { id: id } })
}
/**
 * 根据权限id获权限关联
 * @param id
 * @returns {Promise.<void>}
 */
exports.getAuthById = async(id) => {
    return await Auth.getAuth({ where:{ id:id } })
}
/**
 * 删除
 * @param id
 * @returns {Promise.<void>}
 */
exports.delete = async(id) => {
    return await Admin.destroy({
        where: {id: id}
    })
}
/**
 * 根据条件获取
 * @param where
 * @returns {Promise.<void>}
 */
exports.getAdminList = async(page, size, where) => {
    return await Admin.findAndCountAll({
        include: [ { model: Auth, required: true, as:'Auth'}],
        where:where,
        offset:page,
        limit:size
    })
}