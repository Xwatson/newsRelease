/**
 * 分类表
 *  Created by xuwus on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')

const category = sequelize.define('xj_category', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        name: { // 分类名称
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        parent_id: { // 上级分类
            type: Sequelize.INTEGER
        },
        is_nav: { // 是否导航
            type: Sequelize.BOOLEAN
        },
        sort: { // 序号
            type: Sequelize.INTEGER
        },
        status: { // 状态
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['ENABLED', 'DISABLED'] // 状态：启用，禁用
        }
    }
)

category.sync() // 创建表

module.exports = category