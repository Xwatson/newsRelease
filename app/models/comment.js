/**
 * 评论表
 *  Created by lxj on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')
const User = require('./user')
const News = require('./news')

const comment = sequelize.define('comment', {
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
            references: {
                // 引用另一个模型
                model: User,

                // 连接模型的列表
                key: 'id',
            },
            comment:'用户Id'
        },
        newsId: { // 新闻关联id
            type: Sequelize.INTEGER,
            field: 'news_id',
            references: {
                // 引用另一个模型
                model: News,

                // 连接模型的列表
                key: 'id',
            },
            comment:'新闻Id'
        },
        content: { // 内容
            type: Sequelize.STRING,
            allowNull: false
        },
        status: { // 状态
            type: Sequelize.ENUM,
            allowNull: false,
            defaultValue:'PASS',
            values: ['PASS', 'REJECT', 'INIT'] // 状态：通过，拒绝，待审核
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
comment.belongsTo(User, { as:'User', foreignKey:'user_id' })
comment.belongsTo(News, { as:'News', foreignKey:'news_id' })

comment.sync() // 创建表

module.exports = comment