const SiteConfig = require('../proxy/siteConfig')

export default async function (ctx, next) {
    ctx.state = {
        title: 'koa2 title'
    }
    const config = await SiteConfig.createConfig({
        name:'百度新闻',
        title:'百度新闻',
        keyWords:'新闻,新闻中心,新闻频道,时事报道',
        description:'新闻,新闻中心,包含有时政新闻,国内新闻,国际新闻,社会新闻,时事评论,新闻图片,新闻专题,新闻论坛,军事,历史,的专业时事报道门户网站',
        statisticsCode:'',
        status:'ACTIVE'
    })
    console.log(config)
    await ctx.render('home', {
    })
}