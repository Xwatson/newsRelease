/**
 * Created by xwatson on 2017/3/29.
 */
const Auth = require('../models/auth')
const AuthOperation = require('../models/authOperation')
const Operation = require('../models/operation')
const AuthMenu = require('../models/authMenu')
const sequelize = require("../models/sequelize")

/**
 * 创建权限
 * @param auth
 * @returns {Promise.<void>}
 */
exports.create = async(auth, menus, operations) => {
    // 启动事务
    const t = await sequelize.transaction()
    try {
        const new_auth = await Auth.create(auth, {transaction: t})
        const authOperation = await new_auth.addAuthOperation(operations, {transaction: t})
        const authMenu = await new_auth.addAuthMenu(menus, {transaction: t})
        await t.commit()
        new_auth.dataValues.operations = operations
        new_auth.dataValues.menus = menus
        return await new_auth
    } catch (e) {
        console.log(`创建权限事务出错：${e}`)
        return await t.rollback()
    }
}
/**
 * 根据操作项id获取操作关联
 * @param id
 * @returns {Promise.<void>}
 */
exports.getOperationById = async(id) => {
    return await Auth.getOperations({where: {id: id}}, {
        'include': [AuthOperation]
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
    return await Auth.findOne({
        include: [
            { all:true }
        ],
        where: {id: id}
    })
}
/**
 * 根据id获取权限(关联)
 * @param id
 * @returns {Promise.<void>}
 */
exports.getAssociationAuthById = async(id) => {
    return await Auth.findOne({ include: [{all:true}] }, {where: {id: id}})
}
/**
 * 修改
 * @param auth
 * @param id
 * @returns {Promise.<void>}
 */
exports.update = async(auth, menus, operations, id) => {
    // 启动事务
    const t = await sequelize.transaction()
    try {
        let new_auth = await Auth.update(auth, {where: {id: id}}, {transaction: t})
        if (new_auth[0]) {
            new_auth = await Auth.findById(id)
            const authOperation = await new_auth.setAuthOperation(operations, {transaction: t})
            const authMenu = await new_auth.setAuthMenu(menus, {transaction: t})
            new_auth.dataValues.operations = operations
            new_auth.dataValues.menus = menus
            await t.commit()
            return await new_auth
        }
        return await t.rollback()
    } catch (e) {
        console.log(`创建权限事务出错：${e}`)
        return await t.rollback()
    }
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
 * 根据条件获取
 * @param where
 * @returns {Promise.<void>}
 */
exports.getAuthList = async(page, size, where) => {
    return await Auth.findAndCountAll({
        include: [{all:true}],
        where:where,
        offset:page,
        limit:size
    })
}