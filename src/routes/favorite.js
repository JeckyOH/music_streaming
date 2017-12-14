// 3rd party
const assert = require('better-assert')
const router = require('koa-router')()
const debug = require('debug')('app:routes:index')
// 1st party
const db_artists = require('../db/db_artists')
const pre = require('../presenters')
const mw = require('../middleware')
const config = require('../config')
const belt = require('../belt')

/**
 * Get someone`s favorite artists by username.
 */
router.get('/favorites/:username', async ctx => {
    ctx.validateParam('username')
        .required('Please specify the user.')
        .isString()
        .trim()

    const artists = await db_artists.getFavoritesByUsername(ctx.vals.username)
    artists.forEach(pre.presentFavorite)

    await ctx.render('favorite', {
        title: `${ctx.vals.username}'s Favorite Artists`,
        artists: artists,
    })
})

/**
 * Favorite an artist.
 */
router.post('/favorites', mw.ifLogin(), async ctx => {
    ctx.validateBody('aid')
        .required('Please specify the ID of artist.')
        .isString()
        .trim()

    const exist = await db_artists.existFavorite(ctx.currUser.username, ctx.vals.aid)
    if (exist) {
        ctx.response.status = 400
        ctx.body = "This artist has already been favorited."
    }
    else {
        await db_artists.insertFavorite(ctx.currUser.username, ctx.vals.aid)
        ctx.response.status = 200
    }
})

/**
 * Unfavorite an artist.
 */
router.post('/unfavorites', mw.ifLogin(), async ctx => {
    ctx.validateBody('aid')
        .required('Please specify the ID of artist.')
        .isString()
        .trim()

    await db_artists.deleteFavorite(ctx.currUser.username, ctx.vals.aid)

    ctx.flash = {message: ["success", "Successfully unfavorite."]}
    ctx.redirect('back')
})

module.exports = router