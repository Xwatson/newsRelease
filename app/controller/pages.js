const SiteConfig = require('../proxy/siteConfig')
const Category = require('../proxy/category')
const News = require('../proxy/news')
const Comment = require('../proxy/comment')
const moment = require('moment')
// 首页
export async function home(ctx) {
    const site = await getSite(ctx.originalUrl)
    // 获取前10个轮播
    const topCarousel = await News.getNewsByWhere({ is_carousel:true }, { order: 'updatedAt DESC', limit:10 })
    // 获取20个最新资讯
    const newsOptional = await News.getNewsByWhere({}, { order: 'updatedAt DESC', limit:20 })
    // 获取前10点击最高新闻
    const accessNews = await News.getNewsByWhere({}, { order: 'accessCount DESC', limit:10 })
    // 获取前10条国内新闻
    const domesticNews = await News.getNewsByWhere({ category_id:4 }, { order: 'updatedAt DESC', limit:10 })
    // 获取前10条国际新闻
    const internationalNews = await News.getNewsByWhere({ category_id:5 }, { order: 'updatedAt DESC', limit:10 })
    // 获取前10条军事新闻
    const militaryNews = await News.getNewsByWhere({ category_id:6 }, { order: 'updatedAt DESC', limit:10 })
    // 获取前10条社会新闻
    const societyNews = await News.getNewsByWhere({ category_id:7 }, { order: 'updatedAt DESC', limit:10 })
    // 获取前10条科技新闻
    const technologyNews = await News.getNewsByWhere({ category_id:1 }, { order: 'updatedAt DESC', limit:10 })
    // 获取前10条娱乐新闻
    const entertainmentNews = await News.getNewsByWhere({ category_id:8 }, { order: 'updatedAt DESC', limit:10 })
    // 获取前10条财经新闻
    const financeNews = await News.getNewsByWhere({ category_id:9 }, { order: 'updatedAt DESC', limit:10 })
    // 获取前10条体育新闻
    const sportsNews = await News.getNewsByWhere({ category_id:10 }, { order: 'updatedAt DESC', limit:10 })
    return await ctx.render('home', {
        ...site,
        user:ctx.session.user,
        topCarousel:topCarousel,
        newsOptional:newsOptional,
        accessNews:accessNews,
        domesticNews:domesticNews,
        internationalNews:internationalNews,
        militaryNews:militaryNews,
        societyNews:societyNews,
        technologyNews:technologyNews,
        entertainmentNews:entertainmentNews,
        financeNews:financeNews,
        sportsNews:sportsNews,
        title:`首页-${site.title}`
    })
}
// 分类
export async function category(ctx) {
    const data = ctx.query
    data.page = data.page ? data.page -1 : 0
    const router = `/${ctx.params.category}`
    const site = await getSite(router)
    const currentCate = site.category.find((f) => f.router === router )
    const news = await News.getNewsListNoCategory({ category_id:currentCate.id }, data.page, data.size || 20, { order:'updatedAt DESC' })

    return await ctx.render('category', {
        ...site,
        moment:moment,
        user:ctx.session.user,
        currentCate:currentCate,
        news:news,
        paging:getPagin(news, data),
        title:`${currentCate.name}-${site.title}`
    })
}
// 详情
export async function details(ctx) {
    const id = ctx.params.id
    let news = null
    let comment = null
    let router = ''
    if (id) {
        news = await News.getNewsById(id)
        if (news) {
            news = news.dataValues
            comment = await Comment.getCommentByNewsId(id, { order:'createdAt ASC' })
            router = `/${news.Category.name}`
            // 增加访问量
            await News.updateNews({ accessCount:news.accessCount + 1 }, news.id)
        }
    }
    const site = await getSite(router)
    const currentCate = site.category.find((f) => f.router === router )
    return await ctx.render('details', {
        ...site,
        moment:moment,
        user:ctx.session.user,
        news:news,
        comment:comment,
        currentCate:currentCate,
        title:`${site.title}-新闻详情`
    })
}
// 新闻搜索
export async function search(ctx) {
    const data = ctx.query
    if (!data.key) {
        ctx.redirect('/')
        return ctx
    }
    data.page = data.page ? data.page -1 : 0
    const news = await News.getNewsListNoCategory({
        $or:[{title:{ $like:`%${data.key}%` }}, {keyWords:{ $like:`%${data.key}%` }}, {summary:{ $like:`%${data.key}%` }}] },
        data.page,
        data.size || 20,
        { order:'updatedAt DESC' })
    const router = `/${ctx.params.category}`
    const site = await getSite(router)
    const currentCate = site.category.find((f) => f.router === router )

    return await ctx.render('search', {
        ...site,
        moment:moment,
        user:ctx.session.user,
        currentCate:currentCate,
        news:news,
        paging:getPagin(news, data),
        title:`${data.key}-新闻搜索`
    })
}
// 登录
export async function login(ctx) {
    return await ctx.render('login', {
        title:`登录`
    })
}
// 注册
export async function register(ctx) {
    return await ctx.render('register', {
        title:`注册`
    })
}
// 账户
export async function account(ctx) {
    if (!ctx.session.user) {
        ctx.redirect('/')
        return ctx
    }
    const site = await getSite('/')
    return await ctx.render('account', {
        ...site,
        moment:moment,
        user:ctx.session.user,
        title:`个人中心`
    })
}


// 设置分页
const getPagin = (news, data) => {
    const paging = []
    if (news.count < 6) {
        for (let i = 0; i < news.count; i++) {
            paging.push({ page:i + 1, current:i === data.page })
        }
    } else {
        if (data.page > 2) {
            for (let i = data.page - 2; i < news.count; i++) {
                if (i - (data.page - 2) > 5) {
                    paging.push({ page:'...', current:false })
                    paging.push({ page:news.count, current:false })
                    break
                }
                paging.push({ page:i + 1, current:i === data.page })
            }
            if (news.count - 5 > 0 ) {
                paging.unshift({ page:'...', current:false })
                paging.unshift({ page:1, current:false })
            }
        } else {
            for (let i = 0; i < 5; i++) {
                paging.push({ page:i + 1, current:i === data.page })
            }
            paging.push({ page:'...', current:false })
            paging.push({ page:news.count, current:false })
        }
    }
    return paging
}
const setMenusData = (id, firstMenu, menus, url) => {
    const find = menus.filter((v) => {
        return id === v.parent_id
    })
    if (find.length) {
        find.map((f) => {
            f.key = `${firstMenu.key}_${f.id}`
            if (url === f.router) {
                f.current = `<span class="sr-only">(current)</span>`
            }
            firstMenu.child = find
            setMenusData(f.id, f, menus, url)
        })
    }
}
const nav = (nav) => {
    return nav.map((item) => {
        if (nav.child) {
            return `<li class="dropdown">
                        <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">${item.name} <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            ${nav(item.child)}
                        </ul>`
        } else {
            return `<li ${item.current ? 'class="active"' : ''}><a href="${item.router !== '/' ? '/nav' + item.router : '/'}">
               ${item.name}${item.current || ''}</a></li>`
        }
    })
}

export async function getSite(url) {
    url = url.substr(0, url.indexOf('?') > -1 ? url.indexOf('?') : url.length) || '/'
    const site = await SiteConfig.getConfig()
    const category = await Category.getCategoryByWhere({ is_nav:true, status:'ENABLED' })
    category.map((item, i) => {
        category[i] = item.dataValues
    })
    category.unshift({ id:-1, name:'首页', router:'/', parent_id:0 })
    const firstMenu = category.filter((item) => item.parent_id === 0)
    firstMenu.map((item, i) => {
        item.key = `${i}`
        if (url === item.router) {
            item.current = `<span class="sr-only">(current)</span>`
        }
        setMenusData(item.id, item, category, url)
    })
    const sortCategory = firstMenu.sort((a, b) => a.sort - b.sort )
    const navDom = nav(sortCategory)
    return {
        name:site.name,
        title:site.title,
        keyWords:site.keyWords,
        description:site.description,
        statisticsCode:site.statisticsCode,
        status:site.status,
        message:site.message,
        category:sortCategory,
        navBar:navDom.join('')
    }
}