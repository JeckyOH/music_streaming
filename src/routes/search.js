// 3rd party
const assert = require('better-assert')
const router = require('koa-router')()
const debug = require('debug')('app:routes:index')
// 1st party
const db = require('../db/db_fuzzing')
const pre = require('../presenters')
const mw = require('../middleware')
const config = require('../config')
const belt = require('../belt')

/**
 * Search function on the index page. Will search against tracks title, tracks genre, artist name and so on.
 *
 * @url /search?keyword=xxx[&type={artists | tracks}]
 */
router.get('/search', async ctx => {
    ctx.validateQuery('keyword')
        .required()
        .isString()
        .trim()

    ctx.validateQuery('type')
        .optional()
        .isString()
        .trim()
        .isIn(['artists', 'tracks'], 'Invalid searching types. Only artists and tracks.')

    const related_trakcks = await db.getTracksByKeyword(ctx.vals.keyword, config.FUZZING_SEARCH_LIMIT)
    related_trakcks.forEach(pre.presentTracks)

    const related_albums = await db.getAlbumsByKeyword(ctx.vals.keyword, config.FUZZING_SEARCH_LIMIT)
    related_albums.forEach(pre.presentAlbums)

    const related_artists = await db.getArtistsByKeyword(ctx.vals.keyword, config.FUZZING_SEARCH_LIMIT)
    related_artists.forEach(pre.presentArtists)

    const related_users = await db.getUsersByKeyword(ctx.vals.keyword, config.FUZZING_SEARCH_LIMIT)
    related_users.forEach(pre.presentUser)

    const related_playlists = await db.getPlaylistByKeyword(ctx.vals.keyword, config.FUZZING_SEARCH_LIMIT)
    related_playlists.forEach(pre.presentPlaylists)

    await ctx.render('search', {
        tracks: related_trakcks,
        albums: related_albums,
        artists: related_artists,
        users: related_users,
        playlists: related_playlists
    })
})

module.exports = router