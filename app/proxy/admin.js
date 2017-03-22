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

