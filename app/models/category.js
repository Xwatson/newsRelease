/**
 * 总分类
 * Created by xwatson on 2016/12/24.
 */
import mongoose from 'mongoose'
import { baseStatics, baseSave } from './common'

const categorySchema = new mongoose.Schema({
    // 分类名称
    name: {
        unique: true,
        type: String
    },
    // 状态 0不可用，1可用
    state: {
        type:Number,
        default:1
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
baseStatics(categorySchema)

baseSave(categorySchema)

export default mongoose.model('Category', categorySchema)
