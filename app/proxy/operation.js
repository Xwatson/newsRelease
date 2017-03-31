/**
 * Created by xwatson on 2017/3/30.
 */
const Operation = require('../models/operation')
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