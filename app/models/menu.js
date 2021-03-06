/**
 * 菜单表
 *  Created by lxj on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')
const Auth = require('./auth')
const AuthMenu = require('./authMenu')

const menu = sequelize.define('menu', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        name: { // 菜单名
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        router: { // 路由
            type: Sequelize.STRING
        },
        icon: { // 图标
            type: Sequelize.STRING
        },
        sort: { // 序号
            type: Sequelize.INTEGER
        },
        parent_id:{ // 上级id
            type: Sequelize.INTEGER,
            defaultValue:0
        },
        status: { // 状态
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['ENABLED', 'DISABLED'] // 状态：启用，禁用
        }
    }
)
// 多个menu对多个auth
menu.belongsToMany(Auth, { through: AuthMenu, foreignKey:'menu_id', as:'AuthMenu' })
// 多个auth对多个menu
Auth.belongsToMany(menu, { through: AuthMenu, foreignKey:'auth_id', as:'AuthMenu' })

menu.sync() // 创建表

module.exports = menu