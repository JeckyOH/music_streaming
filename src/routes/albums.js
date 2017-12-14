// 3rd party
const assert = require('better-assert')
const router = require('koa-router')()
const debug = require('debug')('app:routes:index')
// 1st party
const db_albums = require('../db/db_albums')
const pre = require('../presenters')
const mw = require('../middleware')
const config = require('../config')
const belt = require('../belt')

/**
 * get information of an album.
 */
router.get('/album/:alid', async ctx => {
    ctx
        .validateParam('alid')
        .required('Which album do you want to look into?')
        .isString()
        .trim()

    tracks = await db_albums.getTracksByAlbum(ctx.vals.alid)

    if(!tracks) {
        ctx.flash = {message: ["error", "Failed to get information of this album."]}
        ctx.redirect('back')
    }

    await ctx.render('album', {
        alid: ctx.vals.alid,
        tracks: tracks
    })
})

/**
 * Rate a track.
 */
router.post('/rating', mw.ifLogin(), async ctx => {
    ctx
        .validateBody('tid')
        .required('Which track do you want to play?')
        .isString()
        .trim()

    ctx
        .validateBody('score')
        .required()
        .isInt("Score must be an integer.")

    if (await db_tracks.insertRating(ctx.currUser.username, ctx.vals.tid, ctx.vals.score)) {
        ctx.flash = {message: ["success", "Successfully rating the track."]}
    }
    else {
        ctx.flash = {message: ["error", "Failed rating the track."]}
    }
    await ctx.render('back')
})

module.exports = router