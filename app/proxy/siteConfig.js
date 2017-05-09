/**
 * Created by lxj on 2017/3/13.
 */
const SiteConfig = require('../models/siteConfig')

/**
 * 获取站点配置信息
 * @returns {Promise.<void>}
 */
exports.getConfig = async() => {
    return await SiteConfig.findOne()
}

exports.createConfig = async(config) => {
    let user = await SiteConfig.findOne()
    if (user) {
        return user
    }
    return await SiteConfig.create(config)
}
/**
 * 更新
 * @param siteConfig
 * @param id
 * @returns {Promise.<void>}
 */
exports.updateConfig = async(siteConfig, id) => {
    return await SiteConfig.update(siteConfig, { where:{ id:id } })
}
