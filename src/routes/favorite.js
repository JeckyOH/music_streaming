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
        title: `${ctx.vals.username}'s Favorite Artists`
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
        ctx.flash = {message : ["info", "Favorite exist. Nothing updated."]}
        ctx.redirect('back')
    }
    await db_artists.insertFavorite(ctx.currUser.username, ctx.vals.aid)
    ctx.flash = {message : ["success", "Successfully mark an artist as favorite."]}
    ctx.redirect('back')
})

module.exports = router