/**
 * Created by xwatson on 2017/3/29.
 */
const Auth = require('../models/auth')
const OperationModal = require('../models/operation')
const sequelize = require("../models/sequelize")

/**
 * 创建权限
 * @param auth
 * @returns {Promise.<void>}
 */
exports.create = async(auth) => {
    // 启动事务
    return await sequelize.transaction((t) => {
        return Auth.create(auth, {transaction: t}).then((auth) => {
            console.log(auth)
            return auth
        })
        .then(t.rollback.bind(t))
        .catch(t.rollback.bind(t))
    })
}
/**
 * 根据操作项id获取操作关联
 * @param id
 * @returns {Promise.<void>}
 */
exports.getOperationById = async(id) => {
    return await Auth.getOperations({where: {id: id}}, {
        'include': [OperationModal]
    })
}
/**
 * 根据name获取权限
 * @param name
 * @returns {Promise.<void>}
 */
exports.getAuthByName = async(name) => {
    return await Auth.findAll({where: {name: name}})
}
/**
 * 根据id获取权限
 * @param id
 * @returns {Promise.<void>}
 */
exports.getAuthById = async(id) => {
    return await Auth.findOne({where: {id: id}}, {
        'include': [OperationModal]
    })
}
/**
 * 修改
 * @param auth
 * @param id
 * @returns {Promise.<void>}
 */
exports.update = async(auth, id) => {
    return await Auth.update(auth, {where: {id: id}}, {
        'include': [OperationModal]
    })
}
/**
 * 删除
 * @param id
 * @returns {Promise.<void>}
 */
exports.delete = async(id) => {
    return await Auth.destroy({
        where: {id: id}
    })
}
/**
 * 根据id获取
 * @param id
 * @returns {Promise.<void>}
 */
exports.getAuthById = async(id) => {
    return await Auth.findOne({
        where: {id: id}
    }, {
        'include': [OperationModal]
    })
}
/**
 * 根据条件获取
 * @param where
 * @returns {Promise.<void>}
 */
exports.getAuthByWhere = async(where) => {
    return await Auth.findAll({
        'include': [OperationModal]
    }, where)
}