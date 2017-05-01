/**
 * 权限配置表
 *  Created by xuwus on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')
const Admin = require('./admin')

const auth = sequelize.define('auth', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        name: { // 权限名称
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        status: { // 状态
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['ENABLED', 'DISABLED'] // 状态：启用，禁用
        }
    }
)

// 一个auth对多个admin
// auth.hasMany(Admin, { foreignKey:'auth_id', as:'Admin' })

auth.sync() // 创建表

module.exports = auth