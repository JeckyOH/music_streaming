// 3rd party
const assert = require('better-assert')
const router = require('koa-router')()
const debug = require('debug')('app:routes:index')
// 1st party
const db_users = require('../db/db_users')
const db_playlists = require('../db/db_playlists')
const pre = require('../presenters')
const mw = require('../middleware')
const config = require('../config')
const belt = require('../belt')

/**
 * Get the profile of an user.
 */
router.get('/profile/:username', async ctx => {
    ctx.validateParam('username')
        .required('Please specify the user.')
        .isString()
        .trim()

    const basic_info = await db_users.getUserByUname(ctx.vals.username)
    pre.presentUser(basic_info)

    const moments = await db_users.getMomentByUsername(ctx.vals.username)

    const playlists = await db_playlists.getPlaylistByUsername(ctx.vals.username)

    await ctx.render('user_info', {
        basic_info: basic_info,
        playlists: playlists,
        following: moments.following,
        followed: moments.followed,
        rating: moments.rating,
        favorite: moments.favorite,
        tracksplayed: moments.tracksplayed,
        playlistsplayed: moments.playlistsplayed
    })
})

/**
 * modify own profile.
 */
router.get('/profile/:username/edit', mw.ifLogin(), async ctx => {

    const basic_info = await db_users.getUserByUname(ctx.currUser.username)
    pre.presentUser(basic_info)

    await ctx.render('profile', {
        basic_info: basic_info
    })
})

/**
 * Update the basic information of an user.
 */
router.post('/profile/:username/edit', mw.ifLogin(), async ctx => {
    ctx
        .validateParam('username')
        .required('Please specify the user.')
        .isString()
        .trim()
    ctx
        .validateBody('ucity')
        .optional()
        .isString()
        .trim()
        .match(
            /^[a-zA-Z,. ]+$/i,
            'City must only contain a-z, A-Z, comma(,), space( ) or dot(.)'
        )

    ctx
        .validateBody('uemail')
        .optional()
        .isString()
        .trim()
    ctx
        .validateBody('uname')
        .optional()
        .isString()
        .trim()
        .match(
            /^[a-zA-Z. ]+$/i,
            'Name must only contain a-z, A-Z, space( ) or dot(.)'
        )

    if (ctx.vals.email) {
        ctx.validateBody('email').isEmail()
    }

    if(ctx.currUser.username !== ctx.vals.username){
        ctx.flash = { message: ['danger', 'Editing other`s profile is not allowed.'] }
        ctx.redirect(`back`)
    }

    await db_users.updateUserBasicInfo(ctx.vals.username, {
        uname: ctx.vals.uname,
        uemail: ctx.vals.uemail,
        ucity: ctx.vals.ucity
    })

    // RESPOND
    ctx.flash = { message: ['success', 'User info updated'] }
    ctx.redirect(`/profile/${ctx.vals.username}`)
})

module.exports = router