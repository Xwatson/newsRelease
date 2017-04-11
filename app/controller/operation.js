/**
 * Created by xwatson on 2017/4/2.
 */
const responseCode = require('../common/responseCode')
const Operation = require('../proxy/operation')
const Auth = require('../proxy/auth')
const errLog = '操作项控制器：'

/**
 * 获取
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.get = async(ctx) => {
    const data = ctx.query.body
    const message = {}
    try {
        const operation = await Operation.getOperationById(data.id)
        if (operation) {
            message.code = responseCode.SUCCESS
            message.message = '获取成功'
            message.data = operation
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
    const data = ctx.query.body
    if (!data.page) data.page = 1
    if (!data.size) data.size = 10
    const message = {}
    try {
        const operations = await Operation.getOperations(data.page - 1, data.size)
        if (operations) {
            message.code = responseCode.SUCCESS
            message.message = '获取成功'
            message.data = operations
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
        let operation = await Operation.getOperationByName(data.name)
        if (operation) {
            message.code = responseCode.FAIL
            message.message = '操作项已存在'
            ctx.body = message
            return ctx
        }
        operation = await Operation.create({ name:data.name, type:data.type, status:data.status })
        if (!operation) {
            message.code = responseCode.FAIL
            message.message = '创建失败'
            ctx.body = message
            return ctx
        }
        operation = await Operation.getOperationByName(data.name)
        message.code = responseCode.SUCCESS
        message.message = '创建成功'
        message.data = operation.dataValues
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
            let operation = await Operation.getOperationByName(data.name)
            if (operation) {
                message.code = responseCode.FAIL
                message.message = '操作项已存在'
            } else {
                operation = await Operation.update({ name:data.name, type:data.type, status:data.status })
                if (operation) {
                    message.code = responseCode.SUCCESS
                    message.message = '修改成功'
                    message.data = operation
                } else {
                    message.code = responseCode.FAIL
                    message.message = '修改失败'
                }
            }
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
        const aa = await Operation.getOperationById(data.id)
        const bb = await aa.getAuthOperation()
        console.log(bb)
        const authOperation = await Auth.getOperationById(data.id)
        if (!authOperation) {
            const operation = await Operation.delete(data.id)
            if (operation) {
                message.code = responseCode.SUCCESS
                message.message = '删除成功'
                message.data = operation
            } else {
                message.code = responseCode.FAIL
                message.message = '删除失败'
            }
        } else {
            message.code = responseCode.FAIL
            message.message = '该操作项已被关联'
        }
        ctx.body = ctx
        return ctx
    } catch (err) {
        console.log(`${errLog}删除操作项出错：`, err)
        throw err
    }
}