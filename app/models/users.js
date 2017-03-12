/**
 * Created by xwatson on 2016/12/21.
 */
import mongoose from 'mongoose'
import bcrypt from 'bcrypt' // 密码加盐
const SALT_WORK_FACTOR = 10 // 加盐强度

const userSchema = new mongoose.Schema({
    //注册id(邮箱/用户名/手机号) 登录/查找
    registId: {
        unique: true,//不可重复
        type: String
    },
    //昵称 查找
    nickName: String,
    //名称/艺名/别名
    name: String,
    password: String,
    //性别 0:女 1:男 2:保密
    gender:{
        type:Number,
        default:2
    },
    //等级 0:普通会员 1:会员 ...待扩展
    level: {
        type: Number,
        default: 0
    },
    //验证码
    code:Number,
    //头像
    face:String,
    //状态 0离线1在线
    state:{
        type:Number,
        default:0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})
//模式保存方法 每次存储之前都会调用此方法
userSchema.pre('save', function (next) {
    let user = this
    if (user.isNew) {
        user.meta.createAt = user.meta.updateAt = Date.now()
    } else {
        user.meta.updateAt = Date.now()
    }
    //加盐处理
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) next(err)
            user.password = hash
            next()
        })
    })
})
userSchema.methods={
    //比较密码
    comparePassword: function (pwd, cb) {
        bcrypt.compare(pwd,this.password, function (err,isMatch) {
            if(err) return cb(err)
            cb(null,isMatch)
        })
    }
}
//添加静态方法
userSchema.statics = {
    findAll: function (cb) {
        return this
            .find()
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    },
    findByRegistId: function (id, cb) {
        return this
            .findOne({registId: id})
            .exec(cb)
    },
    findByWhere: function (where,cb) {
        return this
            .find(where,{'password':0})
            .exec(cb)
    }
}

export default mongoose.model('Users', userSchema)
