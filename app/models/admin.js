/**
 * 管理员表
 *  Created by xuwus on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')
const Auth = require('../models/auth')

const admin = sequelize.define('admin', {
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
            references: {
                // 引用另一个模型
                model: Auth,

                // 连接模型的列表
                key: 'id',
            },
            comment:'权限Id'
        },
        adminName: { // 用户名
            type: Sequelize.STRING,
            unique: true,
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
admin.belongsTo(Auth, { as:'Auth', foreignKey:'auth_id' })
admin.sync() // 创建表

module.exports = admin