/**
 * 评论表
 *  Created by xuwus on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')

const comment = sequelize.define('xj_comment', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        userId: { // 用户关联id
            type: Sequelize.INTEGER,
            field: 'user_id',
            comment:'用户Id'
        },
        newsId: { // 新闻关联id
            type: Sequelize.INTEGER,
            field: 'news_id',
            comment:'新闻Id'
        },
        title: { // 新闻标题
            type: Sequelize.STRING,
            allowNull: false
        },
        content: { // 内容
            type: Sequelize.STRING,
            allowNull: false
        },
        status: { // 状态
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['PASS', 'REJECT'] // 状态：通过，拒绝
        }
    },
    {
        indexes: [
            {
                name: 'commentUsers_user_id',
                method: 'BTREE',
                fields: ['user_id']
            },
            {
                name: 'commentNews_news_id',
                method: 'BTREE',
                fields: ['news_id']
            }]
    }
)
comment.sync() // 创建表

module.exports = comment