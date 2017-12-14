// 3rd party
const assert = require('better-assert')
const router = require('koa-router')()
const debug = require('debug')('app:routes:index')
const uuid = require('uuid')

// 1st party
const db_playlists = require('../db/db_playlists')
const pre = require('../presenters')
const mw = require('../middleware')
const config = require('../config')
const belt = require('../belt')

/**
 * Get someone`s playlists.
 */
router.get('/playlists/:username', async ctx => {
        ctx
            .validateParam('username')
            .isString()
            .trim()

        const playlists = await db_playlists.getPlaylistByUsername(ctx.vals.username)

        if (ctx.currUser && (ctx.currUser.username == ctx.vals.username)) {
            for (var idx = playlists.length; idx >= 0; idx--) {
                if (playlists[idx].pstatus === "private") {
                    playlists.splice(idx, 1)
                }
            }
        }
        playlists.forEach(pre.presentPlaylists)

        await ctx.render('playlist', {
            title: "My Playlist",
            playlists: playlists
        })
    }
)

router.get('/myplaylists', mw.ifLogin(), async ctx => {
    const playlists = await db_playlists.getPlaylistByUsername(ctx.currUser.username)
    playlists.forEach(pre.presentPlaylists)

    await ctx.render('playlist', {
        title: "My Playlist",
        playlists: playlists
    })
})

/**
 * Create a playlist.
 */
router.post('/playlists/create', mw.ifLogin(), async ctx => {
    ctx
        .validateBody('ptitle')
        .isString
        .trim()
    ctx
        .validateBody('pstatus')
        .isString()
        .trim()
        .isIn(['private', 'public'])

    const date = (new Date()).toLocaleDateString()
    const pid = uuid.v4()

    const res = await db_playlists.insertPlaylist({
        pid: pid,
        username: ctx.currUser.username,
        pstatus: ctx.vals.pstatus,
        pcreatedate: date,
        pmodifydate: date,
        ptitle: ctx.vals.ptitle
    })
    if (res) {
        ctx.flash = {message: ["success", "Successfully create playlist."]}
    }
    else {
        ctx.flash = {message: ["error", "Unsuccessfully create playlist."]}
    }
    ctx.redirect('/myplaylists')
})

/**
 * Delete a playlist.
 */
router.post('/playlists/delete', mw.ifLogin(), async ctx => {
    ctx
        .validateBody('pid')
        .isString()
        .trim()

    await db_playlists.clearTracksOfPlaylist(ctx.vals.pid)
    await db_playlists.deletePlaylist(ctx.vals.pid)

    ctx.flash = {message: ["success", "Successfully create playlist."]}

    ctx.redirect('/myplaylists')
})

/**
 * Add tracks to a playlist.
 */
router.post('/playlists/addtracks', mw.ifLogin(), async ctx => {
    ctx
        .validateBody('pid')
        .isString()
        .trim()
    ctx
        .validateBody('tid')
        .isString()
        .trim()

    if(await db_playlists.checkOwnership(ctx.vals.pid, ctx.currUser.username) == false) {
        ctx.flash = {message: ["error", "Stop try to damage others` playlists."]}
    }
    else {
        if (await db_playlists.existPlaylistContains(ctx.vals.pid, ctx.vals.tid) === false) {
            await db_playlists.insertPlaylistContains(ctx.vals.pid, ctx.vals.tid)
        }
    }

    ctx.flash = {message: ["success", "Successfully add the track to playlist."]}
    ctx.redirect('back')
})

/**
 * Delete tracks from a playlist.
 */
router.post('/playlists/deletetracks', mw.ifLogin(), async ctx => {
    ctx
        .validateBody('pid')
        .isString()
        .trim()
    ctx
        .validateBody('tid')
        .isString()
        .trim()

    if(await db_playlists.checkOwnership(ctx.vals.pid, ctx.currUser.username) == false) {
        ctx.flash = {message: ["success", "Stop try to damage others` playlists."]}
    }
    await db_playlist.deletePlaylistContains(ctx.vals.pid, ctx.vals.tid)

    ctx.flash = {message: ["success", "Successfully delete the track from playlist."]}
    ctx.redirect('back')
})

/**
 * Get the information of a playlist.
 */
router.get('/playlist/:pid', async ctx => {
    ctx
        .validateBody('pid')
        .isString()
        .trim()
    if (ctx.currUser) {
        const owner = await db_playlists.checkOwnership(ctx.vals.pid, ctx.currUser.username)
        if( owner == false) {
            ctx.flash = {message: ["error", "Stop try to damage others` playlists."]}
            ctx.redirect('back')
        }
        else {
            const tracks = await db_playlists.getTracksByPlaylist(ctx.vals.pid)
            ctx.render('playlist_info', {
                tracks: tracks
            })
        }
    }
    else {
        const playlist = await db_playlists.getPlaylistByPid(ctx.vals.pid)
        if(playlist && playlist.pstatus == 'public'){
            const tracks = await db_playlists.getTracksByPlaylist(ctx.vals.pid)
            ctx.render('playlist_info', {
                tracks: tracks
            })
        }
        else {
            ctx.flash = {message: ["error", "Stop try to damage others` playlists."]}
            ctx.redirect('back')
        }
    }
})

module.exports = router