/**
 * Created by xwatson on 2016/12/24.
 */
import mongoose from 'mongoose'
import { baseStatics, baseSave } from './common'

const countrySchema = new mongoose.Schema({
    // 国家名称
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
baseStatics(countrySchema)

baseSave(countrySchema)

export default mongoose.model('Country', countrySchema)
