/**
 * 站点配置表
 * Created by lxj on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')

const siteConfig = sequelize.define('siteConfig', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
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
        keyWords: { // 网站关键字
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
        message: { // 维护信息
            type: Sequelize.STRING
        }
    }
)

siteConfig.sync() // 创建表

module.exports = siteConfig