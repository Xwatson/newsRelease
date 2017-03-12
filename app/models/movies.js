/**
 * 电影
 * Created by xwatson on 2016/12/24.
 */
import mongoose from 'mongoose'
import { baseStatics, baseSave } from './common'

const movieSchema = new mongoose.Schema({
    // 电影名称
    name: {
        type: String
    },
    // 图片
    images: {
        type: String
    },
    // 原名
    originalName: {
      type: String
    },
    // 导演
    director: {
        type: String
    },
    // 编剧
    screenwriter: {
        type: String
    },
    // 主演
    starring: {
        type: String
    },
    // 电影类型
    movieTypeIds: {
        type: String
    },
    // 制片国家
    countryIds: {
        type: String
    },
    // 语言
    language: {
      type: String
    },
    // 上映日期
    releaseDate: {
        type: Date
    },
    // 片长
    movieLength: {
      type: Number
    },
    // 又名
    aliasName: {
      type: String
    },
    // 豆瓣评分
    dbStore: {
        type: Number
    },
    // imdb评分
    imdbStore: {
      type: Number
    },
    // imdb链接
    imdbLink: {
      type: String
    },
    // 状态 0不可用，1可用
    state: {
        type:Number,
        default:1
    },
    // 简介
    introduction: {
        type: String
    },
    // 预告片
    noticeUrl: {
      type: String
    },
    // 剧照
    stagePhoto: {
      type: String
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
baseStatics(movieSchema)

baseSave(movieSchema)

export default mongoose.model('Movies', movieSchema)
