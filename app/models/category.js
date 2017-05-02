/**
 * 分类表
 *  Created by lxj on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')
const News = require('../models/news')

const category = sequelize.define('category', {
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
            type: Sequelize.INTEGER,
            defaultValue:0
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
// 一个category对多个news
category.hasMany(News, { foreignKey:'category_id', targetKey:'id', as:'News' })
News.belongsTo(category, { as:'Category', foreignKey:'category_id' })

category.sync() // 创建表

module.exports = category