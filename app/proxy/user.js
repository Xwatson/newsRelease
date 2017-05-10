/**
 * Created by lxj on 2017/4/10.
 */
const User = require('../models/user')
/**
 * 根据name获取
 * @param name
 * @returns {Promise.<void>}
 */
exports.getUserByEmail = async(email) => {
    return await User.findOne({
        where:{ email:email }
    })
}

/**
 * 根据id获取
 * @param id
 * @returns {Promise.<void>}
 */
exports.getUserById = async(id) => {
    return await User.findById(id)
}
/**
 * 获取所有数据
 * @returns {Promise.<menu>}
 */
exports.getUserList = async(where ,page, size) => {
    return await User.findAndCountAll({
        where:where,
        offset:page,
        limit:size
    })
}
/**
 * 创建
 * @param user
 * @returns {Promise.<void>}
 */
exports.createUser = async(user) => {
    return await User.create(user)
}

/**
 * 根据id删除
 * @param id
 * @returns {Promise.<void>}
 */
exports.deleteUser = async(id) => {
    return await User.destroy({
        where:{ id:id }
    })
}

/**
 * 更新
 * @param user
 * @param id
 * @returns {Promise.<void>}
 */
exports.updateUser = async(user, id) => {
    return await User.update(user, { where:{ id:id } })
}
