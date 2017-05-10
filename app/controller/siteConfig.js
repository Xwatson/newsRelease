/**
 * Created by xwatson on 2017/5/10.
 */
const responseCode = require('../common/responseCode')
const SiteConfig = require('../proxy/siteConfig')
const errLog = '站点配置控制器：'

/**
 * 获取
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.get = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    try {
        const site = await SiteConfig.getConfig()
        if (site) {
            message.code = responseCode.SUCCESS
            message.message = '修改成功'
            message.data = site
        } else {
            message.code = responseCode.FAIL
            message.message = '获取失败'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}获取站点配置出错：`, err)
    }
}
/**
 * 修改
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.update = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    try {
        const site = await SiteConfig.updateConfig({
            name:data.name,
            title:data.title,
            keyWords:data.keyWords,
            description:data.description,
            statisticsCode:data.statisticsCode,
            status:data.status,
            message:data.message
        }, 1)
        if (site) {
            message.code = responseCode.SUCCESS
            message.message = '修改成功'
        } else {
            message.code = responseCode.FAIL
            message.message = '修改失败'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}修改站点配置出错：`, err)
    }
}