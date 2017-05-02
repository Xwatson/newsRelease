/**
 * 操作表
 *  Created by lxj on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')
const Auth = require('./auth')
const AuthOperation = require('./authOperation')

const operation = sequelize.define('operation', {
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
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['CREATE', 'DELETE', 'UPDATE', 'SELECT', 'REVIEW'] // 增、删、改、查、审核
        },
        status: { // 状态
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['ENABLED', 'DISABLED'] // 状态：启用，禁用
        }
    }
)
// 多个operation对多个auth
operation.belongsToMany(Auth, { through: AuthOperation, foreignKey:'operation_id', as:'AuthOperation' })
// 多个auth对多个operation
Auth.belongsToMany(operation, { through: AuthOperation, foreignKey:'auth_id', as:'AuthOperation' })

operation.sync() // 创建表

module.exports = operation