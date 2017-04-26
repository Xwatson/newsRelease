/**
 * Created by xwatson on 2017/4/26.
 */
const responseCode = require('../common/responseCode')
const Operation = require('../proxy/operation')
const User = require('../proxy/user')
const Comment = require('../proxy/comment')
const encipher = require('../common/encipher')
const errLog = '用户控制器：'

/**
 * 获取
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.get = async(ctx) => {
    const data = ctx.query
    const message = {}
    try {
        const user = await User.getUserById(data.id)
        if (user) {
            message.code = responseCode.SUCCESS
            message.message = '获取成功'
            message.data = user
        } else {
            message.code = responseCode.FAIL
            message.message = '该操作不存在'
        }
        ctx.body = message
        return ctx
    }catch (err) {
        console.log(`${errLog}获取出错：`, err)
        throw err
    }
}
/**
 * 获取列表
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.list = async(ctx) => {
    const data = ctx.query
    if (!data.page) data.page = 1
    if (!data.size) data.size = 10
    const message = {}
    try {
        const users = await User.getUserList({}, parseInt(data.page) - 1, parseInt(data.size))
        if (users) {
            message.code = responseCode.SUCCESS
            message.message = '获取成功'
            users.totalElement = users.count
            users.content = users.rows
            delete users.count
            delete users.rows
            message.data = users
        } else {
            message.code = responseCode.FAIL
            message.message = '获取失败'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}获取列表出错：`, err)
    }
}
/**
 * 创建
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.create = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    try {
        let user = await User.getUserByEmail(data.email)
        if (user) {
            message.code = responseCode.FAIL
            message.message = '邮箱已存在'
            ctx.body = message
            return ctx
        }
        user = await User.createUser({
            nickName:data.nickName,
            email:data.email,
            password:encipher.getMd5(data.password),
            status:data.status,
            name:data.name,
            phone:data.phone,
            gender:data.gender,
            address:data.address,
            qq:data.qq,
            birthday:data.birthday,
            integral:data.integral,
            introduction:data.introduction,
            loginTime:data.loginTime,
            loginIP:data.loginIP
        })
        if (!user) {
            message.code = responseCode.FAIL
            message.message = '创建失败'
            ctx.body = message
            return ctx
        }
        user = await User.getUserByEmail(data.email)
        message.code = responseCode.SUCCESS
        message.message = '创建成功'
        message.data = user
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}创建操作出错：`, err)
        throw err
    }
}
/**
 * 修改
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.update = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    try {
        if (data.id) {
            let user = await User.getUserById(data.id)
            if (!user) {
                message.code = responseCode.FAIL
                message.message = 'id不存在'
                ctx.body = message
                return ctx
            }
            if (user.password !== encipher.getMd5(data.password)) {
                message.code = responseCode.FAIL
                message.message = '原始密码不正确'
                ctx.body = message
                return ctx
            }
            user = await User.updateUser({
                nickName:data.nickName,
                email:data.email,
                password:encipher.getMd5(data.new_password),
                status:data.status,
                name:data.name,
                phone:data.phone,
                gender:data.gender,
                address:data.address,
                qq:data.qq,
                birthday:data.birthday,
                integral:data.integral,
                introduction:data.introduction,
                loginTime:data.loginTime,
                loginIP:data.loginIP
            }, data.id)
            if (!user) {
                message.code = responseCode.FAIL
                message.message = '修改失败'
            }
            // user = await User.getUserById(data.id)
            message.code = responseCode.SUCCESS
            message.message = '修改成功'
            message.data = user
            ctx.body = message
            return ctx
        } else {
            message.code = responseCode.FAIL
            message.message = '未找到id字段'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}修改操作项出错：`, err)
    }
}
/**
 * 删除
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.delete = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    try {
        const user = await User.getUserById(data.id)
        if (user) {
            const comment = await Comment.getCommentByUserId(data.id)
            if (!comment.length) {
                // 删除评论
                await Comment.deleteCommentByUserId(data.id)
            }
            const user = await User.deleteUser(data.id)
            if (user) {
                message.code = responseCode.SUCCESS
                message.message = '删除成功'
                message.data = user
            } else {
                message.code = responseCode.FAIL
                message.message = '删除失败'
            }
        } else {
            message.code = responseCode.FAIL
            message.message = 'id不存在'
        }
        ctx.body = message
        return ctx
    } catch (err) {
        console.log(`${errLog}删除用户出错：`, err)
        throw err
    }
}