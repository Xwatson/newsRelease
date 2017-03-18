/**
 * 评论表
 *  Created by xuwus on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')
const user = require('./user')

const comment = sequelize.define('xj_comment', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        title: { // 新闻标题
            type: Sequelize.STRING,
            allowNull: false
        },
        user_id: { // 用户
            type: Sequelize.INTEGER,
            references: {
                model:user,
                key:'id'
            }
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
    }
)

comment.sync() // 创建表

module.exports = comment