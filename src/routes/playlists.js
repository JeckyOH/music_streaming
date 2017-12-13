// 3rd party
const assert = require('better-assert')
const router = require('koa-router')()
const debug = require('debug')('app:routes:index')
// 1st party
const db_playlists = require('../db/db_playlists')
const pre = require('../presenters')
const mw = require('../middleware')
const config = require('../config')
const belt = require('../belt')

router.get('/myplaylists', mw.ifLogin(), async ctx => {
    const playlists = db_playlists.getPlaylistByUsername(ctx.currUser.username)
    playlists.forEach(pre.presentPlaylists)

    await ctx.render('playlist', {
        title: "My Playlist",
        playlists: playlists
    })
})

router.post('/myplaylists/create', mw.ifLogin(), async ctx => {
    ctx
        .validateBody('ptitle')
        .isString
        .trim()
    ctx
        .validateBody('')
})

module.exports = router