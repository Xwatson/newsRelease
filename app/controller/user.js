/**
 * Created by xwatson on 2017/4/26.
 */
const responseCode = require('../common/responseCode')
const Operation = require('../proxy/operation')
const User = require('../proxy/user')
const Comment = require('../proxy/comment')
const encipher = require('../common/encipher')
const upload = require('./upload')
const moment = require('moment')
const netWork = require('../common/netWorkInterfaces')
const errLog = '用户控制器：'

/**
 * 登录
 * @param ctx
 * @returns ctx
 */
exports.login = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    const user = await User.getUserByEmail(data.email)
    if (!user) {
        message.code = responseCode.FAIL
        message.message = '账户不存在'
        ctx.body = message
        return ctx
    }
    if (user.status === 'DISABLED') {
        message.code = responseCode.FAIL
        message.message = '账户被禁用'
        ctx.body = message
        return ctx
    }
    if (encipher.getMd5(data.password) !== user.password) {
        message.code = responseCode.FAIL
        message.message = '密码错误'
        ctx.body = message
        return ctx
    }
    await User.updateUser({
        loginTime:moment().format('YYYY-MM-DD HH:mm:ss'),
        loginIP:netWork.getIp()
    }, user.dataValues.id)
    ctx.session.user = user.dataValues
    message.code = responseCode.SUCCESS
    message.message = '登录成功'
    ctx.body = message
    return ctx
}
/**
 * 退出
 * @param ctx
 * @returns ctx
 */
exports.loginOut = async(ctx) => {
    const message = {}
    ctx.session.user =null
    message.code = responseCode.SUCCESS
    message.message = '登出成功'
    ctx.body = message
    return ctx.redirect('/')
}
/**
 * 基本信息修改
 * @param ctx
 * @returns ctx
 */
exports.updateUserInfo = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    if (!ctx.session.user) {
        message.code = responseCode.AUTH_EXPIRED
        message.message = '登录超时，请重新登录'
        ctx.body = message
        return ctx
    }
    let user = await User.updateUser({
        name:data.name || null,
        phone:data.phone || null,
        gender:data.gender || null,
        address:data.address || null,
        qq:data.qq || null,
        birthday:data.birthday || null,
        introduction:data.introduction || null
    }, ctx.session.user.id)
    if (user) {
        message.code = responseCode.SUCCESS
        message.message = '修改成功'
        user = await User.getUserById(ctx.session.user.id)
        ctx.session.user = user.dataValues
    } else {
        message.code = responseCode.FAIL
        message.message = '修改失败，请重试！'
    }
    ctx.body = message
    return ctx
}
/**
 * 密码修改
 * @param ctx
 * @returns ctx
 */
exports.updatePassword = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    if (!ctx.session.user) {
        message.code = responseCode.AUTH_EXPIRED
        message.message = '登录超时，请重新登录'
        ctx.body = message
        return ctx
    }
    if (encipher.getMd5(data.oldPassword) !== ctx.session.user.password) {
        message.code = responseCode.FAIL
        message.message = '原始密码不正确'
        ctx.body = message
        return ctx
    }
    let user = await User.updateUser({
        password:encipher.getMd5(data.password)
    }, ctx.session.user.id)
    if (user) {
        message.code = responseCode.SUCCESS
        message.message = '修改成功'
        user = await User.getUserById(ctx.session.user.id)
        ctx.session.user = user.dataValues
    } else {
        message.code = responseCode.FAIL
        message.message = '修改失败，请重试！'
    }
    ctx.body = message
    return ctx
}
/**
 * 头像修改
 * @param ctx
 * @returns ctx
 */
exports.updateHeadPortrait = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    if (!ctx.session.user) {
        message.code = responseCode.AUTH_EXPIRED
        message.message = '登录超时，请重新登录'
        ctx.body = `<script>alert('${message.message}');window.history.go(-1);</script>`
        return ctx
    }
    let file = null
    if (data.headPortrait[0].size) {
        file = await upload.upload(data.headPortrait, 'uploads/user/')
        if (!file) {
            message.code = responseCode.FAIL
            message.message = '上传图片失败'
            ctx.body = `<script>alert('${message.message}');window.history.go(-1);</script>`
            return ctx
        }
    } else {
        message.code = responseCode.FAIL
        message.message = '请选择图片'
        ctx.body = `<script>alert('${message.message}');window.history.go(-1);</script>`
        return ctx
    }
    let user = await User.updateUser({
        headPortrait:file ? file.path : '/images/user-default.png'
    }, ctx.session.user.id)
    if (user) {
        message.code = responseCode.SUCCESS
        message.message = '修改成功'
        user = await User.getUserById(ctx.session.user.id)
        ctx.session.user = user.dataValues
    } else {
        message.code = responseCode.FAIL
        message.message = '修改失败，请重试！'
    }
    ctx.body = `<script>alert('${message.message}');window.history.go(-1);</script>`
    return ctx
}
/**
 * 注册
 * @param ctx
 * @returns ctx
 */
exports.register = async(ctx) => {
    const data = ctx.request.body
    const message = {}
    try {
        let user = await User.getUserByEmail(data.email)
        if (user) {
            message.code = responseCode.FAIL
            message.message = '邮箱已存在'
            ctx.body = `<script>alert('${message.message}');window.history.go(-1);</script>`
            return ctx
        }
        let file = null
        if (data.headPortrait[0].size) {
            file = await upload.upload(data.headPortrait, 'uploads/user/')
            if (!file) {
                message.code = responseCode.FAIL
                message.message = '上传图片失败'
                ctx.body = message
                return `<script>alert('${message.message}');window.history.go(-1);</script>`
            }
        }
        user = await User.createUser({
            nickName:data.nickName,
            email:data.email,
            password:encipher.getMd5(data.password),
            status:'ENABLED',
            name:data.name || null,
            phone:data.phone || null,
            gender:data.gender || null,
            address:data.address || null,
            qq:data.qq || null,
            birthday:data.birthday || null,
            headPortrait:file.path ? `/${file.path}` : null,
            integral:0,
            introduction:data.introduction || null,
            loginTime:data.loginTime || null,
            loginIP:data.loginIP || null
        })
        if (!user) {
            message.code = responseCode.FAIL
            message.message = '注册失败'
            ctx.body = message
            return ctx
        }
        user = await User.getUserByEmail(data.email)
        message.code = responseCode.SUCCESS
        message.message = '注册成功'
        // message.data = user
        ctx.session.user = user
        ctx.body = `<script>alert('${message.message}');window.location = '/'</script>`
        return ctx
    } catch (err) {
        console.log(`${errLog}注册操作出错：`, err)
        throw err
    }
}
/**
 * 获取
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.get = async(ctx) => {
    const data = Object.assign({}, ctx.params, ctx.query)
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
    const where = {
        nickName:data.nickName,
        email:data.email,
        status:data.status,
        createdAt:data.createdAt
    }
    Object.keys(where).forEach((key) => {
        if (!where[key]) {
            delete where[key]
        }
    })
    if (where.createdAt) {
        const _times = where.createdAt.split('|')
        where.createdAt = {
            $gte:_times[0],
            $lte:_times[1]
        }
    }
    if (where.nickName) {
        where.nickName = { $like:`%${where.nickName}%` }
    }
    if (where.email) {
        where.email = { $like:`%${where.email}%` }
    }
    const message = {}
    try {
        const users = await User.getUserList(where, parseInt(data.page) - 1, parseInt(data.size))
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
            name:data.name || null,
            phone:data.phone || null,
            gender:data.gender || null,
            address:data.address || null,
            qq:data.qq || null,
            birthday:data.birthday || null,
            integral:data.integral || null,
            introduction:data.introduction || null,
            loginTime:data.loginTime || null,
            loginIP:data.loginIP || null
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
            let isUpdatePwd = false
            if (data.password) {
                isUpdatePwd = true
                const password = encipher.getMd5(data.password)
                if (user.dataValues.password !== password) {
                    message.code = responseCode.FAIL
                    message.message = '原始密码错误'
                    ctx.body = message
                    return ctx
                }
            }
            user = await User.updateUser({
                /* nickName:data.nickName,
                email:data.email, */
                password:isUpdatePwd ? encipher.getMd5(data.new_password) : user.dataValues.password,
                status:data.status,
                name:data.name,
                phone:data.phone,
                gender:data.gender,
                address:data.address,
                qq:data.qq,
                birthday:data.birthday || null,
                integral:data.integral || null,
                introduction:data.introduction
            }, data.id)
            if (!user) {
                message.code = responseCode.FAIL
                message.message = '修改失败'
            }
            user = await User.getUserById(data.id)
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