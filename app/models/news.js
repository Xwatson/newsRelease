/**
 * 新闻表
 *  Created by xuwus on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')
const category = require('./category')

const news = sequelize.define('xj_news', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        title: { // 标题
            type: Sequelize.STRING,
            allowNull: false
        },
        keyWords: { // 关键字
            type: Sequelize.STRING,
            allowNull: false
        },
        summary: { // 摘要
            type: Sequelize.STRING,
            allowNull: false
        },
        category_id: { // 分类
            type: Sequelize.INTEGER,
            references: {
                model:category,
                key:'id'
            }
        },
        content: { // 内容
            type: Sequelize.TEXT,
            allowNull: false
        },
        thumbnailPic: { // 缩略图
            type: Sequelize.STRING,
            allowNull: false
        },
        carouselPic: { // 轮播图
            type: Sequelize.STRING
        },
        is_carousel: { // 是否轮播
            type: Sequelize.BOOLEAN
        },
        author: { // 作者
            type: Sequelize.STRING
        },
        source: { // 来源
            type: Sequelize.STRING
        },
        accessCount: { // 访问数
            type: Sequelize.INTEGER
        },
        status: { // 状态
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['ENABLED', 'DISABLED'] // 状态：启用，禁用
        }
    }
)

news.sync() // 创建表

module.exports = news