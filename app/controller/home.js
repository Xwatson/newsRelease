
export default async function (ctx, next) {
    ctx.state = {
        title: 'koa2 title'
    }

    await ctx.render('home', {
    })
}