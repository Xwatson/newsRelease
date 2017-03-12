/**
 * Created by xwatson on 2016/12/24.
 */

/**
 * 基础查询方法
 * @param schema
 */
export function baseStatics(schema) {
    //添加静态方法
    schema.statics = {
        /**
         * 查找所有
         * @param sort 排序字段
         * @param cb
         * @returns {Promise}
         */
        findAll: async function (sort,cb) {
            let data = await this.find().sort(sort)
            if(data) return data
        },
        findById: async function (id, cb) {
            let data = await this.findOne({_id: id})
            if(data) return data
        },
        findByWhere: async function (where, sort, cb) {
            let data = await this.find(where).sort(sort)
            if(data) return data
        }
    }
}
/**
 * 保存
 */
export function baseSave(schema) {
    schema.pre('save', function (next) {
        if (this.isNew) {
            this.meta.createAt = user.meta.updateAt = Date.now()
        } else {
            this.meta.updateAt = Date.now()
        }
    })
}