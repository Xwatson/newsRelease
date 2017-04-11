/**
 * 管理员表
 *  Created by xuwus on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')

const admin = sequelize.define('xj_admin', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        authId:{
            type: Sequelize.INTEGER,
            field: 'auth_id',
            comment:'权限Id'
        },
        adminName: { // 用户名
            type: Sequelize.STRING,
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        email: { // 邮箱
            type: Sequelize.STRING,
            unique: true
        },
        password: { // 密码
            type: Sequelize.STRING,
            allowNull: false
        },
        status: { // 状态
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['ENABLED', 'DISABLED'] // 状态：启用，禁用
        }
    }, {
        indexes: [{
            name: 'adminAuth_admin_id',
            method: 'BTREE',
            fields: ['auth_id']
        }]
    }
)

admin.sync() // 创建表

module.exports = admin