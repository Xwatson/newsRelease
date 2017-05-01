/**
 * Created by xuwus on 2017/4/11.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')

const authOperation = sequelize.define('authMenu', {
        authId: { // 权限关联id
            type: Sequelize.INTEGER,
            field: 'auth_id',
            comment:'权限Id'
        },
        menuId: { // 菜单关联id
            type: Sequelize.INTEGER,
            field: 'menu_id',
            comment:'菜单Id'
        }
    },
    {
        indexes: [
            {
                name: 'authMenu_auth_id',
                method: 'BTREE',
                fields: ['auth_id']
            },
            {
                name: 'authMenu_menu_id',
                method: 'BTREE',
                fields: ['menu_id']
            }]
    }
)

authOperation.sync() // 创建表

module.exports = authOperation