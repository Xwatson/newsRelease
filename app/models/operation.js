/**
 * 操作表
 *  Created by xuwus on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')

const operation = sequelize.define('xj_operation', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        name: { // 操作名称
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        type: { // 类型
            type: Sequelize.STRING
        },
        status: { // 状态
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['ENABLED', 'DISABLED'] // 状态：启用，禁用
        }
    }
)

operation.sync() // 创建表

module.exports = operation