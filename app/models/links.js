/**
 * 友情链接表
 *  Created by lxj on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')

const links = sequelize.define('links', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        name: { // 链接名称
            type: Sequelize.STRING,
            allowNull: false
        },
        url: { // url
            type: Sequelize.STRING,
            allowNull: false
        },
        icon: { // 图标
            type: Sequelize.STRING
        },
        sort: { // 序号
            type: Sequelize.INTEGER,
            allowNull: false
        },
        status: { // 状态
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['ENABLED', 'DISABLED'] // 状态：启用，禁用
        }
    }
)

links.sync() // 创建表

module.exports = links