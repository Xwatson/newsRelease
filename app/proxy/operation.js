/**
 * Created by xwatson on 2017/3/30.
 */
const Operation = require('../models/operation')
const Auth = require('../models/auth')
/**
 * 根据Id查询
 * @param id
 * @returns {Promise.<menu>}
 */
exports.getOperationById = async(id) => {
    return await Operation.findOne({ where:{ id:id } })
}
/**
 * 根据名称查询
 * @param name
 * @returns {Promise.<menu>}
 */
exports.getOperationByName = async(name) => {
    return await Operation.findOne({ where:{ name:name } })
}
/**
 * 获取所有数据
 * @returns {Promise.<menu>}
 */
exports.getOperations = async() => {
    return await Operation.findAll({
        'include': [Auth]
    })
}
/**
 * 根于自定义条件获取所有数据
 * @param where
 * @returns {Promise.<menu>}
 */
exports.getOperationsByWhere = async(where) => {
    return await Operation.findAll(where)
}
/**
 * 添加
 * @param menu
 * @returns {Promise.<menu>}
 */
exports.create = async(operation) => {
    return await Operation.create(operation)
}

/**
 * 修改
 * @param operation
 * @returns {Promise}
 */
exports.update = async(operation) => {
    return await Operation.update({
        name:operation.name,
        type:operation.type,
        status:operation.name
    }, {
        where: {
            id: operation.id
        }
    })
}
/**
 * 删除
 * @param id
 * @returns {Promise.<*|Promise.<Integer>|Promise.<undefined>>}
 */
exports.delete = async(id) => {
    return await Operation.destroy({
        where:{ id:id }
    })
}