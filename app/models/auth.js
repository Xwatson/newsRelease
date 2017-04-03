/**
 * 权限配置表
 *  Created by xuwus on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')
const operation = require('./operation')

const auth = sequelize.define('xj_auth', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        adminId:{
            type: Sequelize.INTEGER,
            field: 'admin_id',
            allowNull: false,
            comment:'管理员Id'
        },
        name: { // 权限名称
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        menu_ids:{ // 菜单id数组
            type: Sequelize.STRING(1000),
        },
        menu_names:{ // 菜单name数组
            type: Sequelize.STRING(2000),
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
            fields: ['admin_id']
        }]
    }
)
// 一个auth对多个menu
/*auth.hasMany(menu)
menu.belongsTo(auth)*/

// 一个auth对多个operation
auth.hasMany(operation, {foreignKey:'auth_id', targetKey:'id', as:'operation'})
operation.belongsTo(auth, {foreignKey:'auth_id'})

auth.sync() // 创建表

module.exports = auth