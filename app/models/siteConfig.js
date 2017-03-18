/**
 * 站点配置表
 * Created by xuwus on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')

const siteConfig = sequelize.define('xj_siteConfig', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        name: { // 网站名称
            type: Sequelize.STRING,
            allowNull: false
        },
        title: { // 网站标题
            type: Sequelize.STRING,
            allowNull: false
        },
        keyWords: { // 网站标题
            type: Sequelize.STRING,
            allowNull: false
        },
        description: { // 网站描述
            type: Sequelize.STRING
        },
        statisticsCode: { // 统计代码
            type: Sequelize.STRING(2000)
        },
        status: { // 网站状态
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['ACTIVE', 'MAINTAIN', 'CLOSE'] // 状态：激活，维护，关闭
        },
        isClose: { // 关闭时显示的文字
            type: Sequelize.STRING
        }
    }
)

siteConfig.sync() // 创建表

module.exports = siteConfig