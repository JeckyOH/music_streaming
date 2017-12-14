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

    album = await db_albums.getTracksByAlbum(ctx.vals.alid)

    if(!album) {
        ctx.flash = {message: ["danger", "Album does not exist."]}
        ctx.redirect('back')
    }

    tracks = await db_albums.getTracksByAlbum(ctx.vals.alid)
    tracks.forEach(pre.presentTracks)

    if(!tracks) {
        ctx.flash = {message: ["danger", "Failed to get information of this album."]}
        ctx.redirect('back')
    }

    await ctx.render('album', {
        alname: album.alname,
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
        ctx.flash = {message: ["danger", "Failed rating the track."]}
    }
    await ctx.render('back')
})

module.exports = router