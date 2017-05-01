/**
 * Created by xuwus on 2017/4/11.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')

const authOperation = sequelize.define('authOperation', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        authId: { // 权限关联id
            type: Sequelize.INTEGER,
            field: 'auth_id',
            comment:'权限Id'
        },
        operationId: { // 操作关联id
            type: Sequelize.INTEGER,
            field: 'operation_id',
            comment:'操作Id'
        }
    },
    {
        indexes: [
            {
                name: 'authOperation_auth_id',
                method: 'BTREE',
                fields: ['auth_id']
            },
            {
                name: 'authOperation_operation_id',
                method: 'BTREE',
                fields: ['operation_id']
            }]
    }
)

authOperation.sync() // 创建表

module.exports = authOperation