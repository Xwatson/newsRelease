/**
 * Created by xuwus on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')

const SiteConfig = sequelize.define('SiteConfig', {
        siteName: { // 网站名称
            type: Sequelize.STRING,
            allowNull: false
        },
        siteTitle: { // 网站标题
            type: Sequelize.STRING,
            allowNull: false
        },
        siteKeyWords: { // 网站标题
            type: Sequelize.STRING,
            allowNull: false
        },
        siteDescription: { // 网站描述
            type: Sequelize.STRING
        },
        sitePublicKeyWords: { // 全局关键字
            type: Sequelize.STRING
        },
        siteStatus: { // 网站状态
            type: Sequelize.INTEGER,
            allowNull: false
        },
        siteCloseNote: { // 关闭时显示的文字
            type: Sequelize.STRING,
        }
    }
)

SiteConfig.sync() // 创建表

module.exports = SiteConfig