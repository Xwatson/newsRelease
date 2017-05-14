/**
 * Created by xwatson on 2017/5/12.
 */
import path from 'path'
import fs from 'fs'

exports.upload = async (files, basePath) => {2
    return new Promise((resolve, reject) => {
        if (files.length > 0) {
            try {
                files.forEach((item) => {
                    let tmpath = item.path
                    let tmparr = item.name.split('.')
                    let ext = '.' + tmparr[tmparr.length - 1]
                    // let basePath = 'uploads/news/'
                    let id = parseInt(Math.random() * 100) + Date.parse(new Date()).toString()
                    let fileName = id + ext
                    let newpath = path.join(path.join(__dirname, '../../public/') + basePath, fileName)
                    let stream = fs.createWriteStream(newpath)//创建一个可写流
                    fs.createReadStream(tmpath).pipe(stream)//可读流通过管道写入可写流
                    resolve({ id:id, name:fileName, path: `${basePath}${fileName}` })
                })
            } catch (e) {
                console.log('上传出错：', e)
                reject(null)
            }
        } else {
            reject(null)
        }
    })
}