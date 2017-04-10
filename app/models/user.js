/**
 * 用户表
 * Created by xuwus on 2017/3/13.
 */
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')
const Comment = require('../models/comment')

const user = sequelize.define('xj_user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        nickName: { // 昵称
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        email: { // 邮箱
            type: Sequelize.STRING,
            unique: true
        },
        password: { // 密码
            type: Sequelize.STRING,
            allowNull: false
        },
        status: { // 状态
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['ENABLED', 'DISABLED'] // 状态：启用，禁用
        },
        name: { // 姓名
            type: Sequelize.STRING
        },
        headPortrait: { // 头像
            type: Sequelize.STRING
        },
        phone: { // 手机
            type: Sequelize.STRING
        },
        gender: { // 性别
            type: Sequelize.ENUM,
            values: ['MAN', 'FEMALE', 'SECRECY'] // 状态：男，女，保密
        },
        address: { // 联系地址
            type: Sequelize.STRING
        },
        qq: { // QQ
            type: Sequelize.STRING
        },
        birthday: { // 生日
            type: Sequelize.DATE
        },
        integral: { // 积分
            type: Sequelize.INTEGER
        },
        introduction: { // 介绍
            type: Sequelize.STRING(2000)
        },
        loginTime: { // 登录时间
            type: Sequelize.DATE
        },
        loginIP: { // IP
            type: Sequelize.STRING
        }
    }
)

// 一个user对多个comment
user.hasMany(Comment, { foreignKey:'user_id', targetKey:'id', as:'CommentUser' })

user.sync() // 创建表

module.exports = user