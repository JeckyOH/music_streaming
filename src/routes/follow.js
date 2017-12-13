// 3rd party
const assert = require('better-assert')
const router = require('koa-router')()
const debug = require('debug')('app:routes:index')
// 1st party
const db_users = require('../db/db_users')
const pre = require('../presenters')
const mw = require('../middleware')
const config = require('../config')
const belt = require('../belt')

/**
 * Get the followers of an user, which means who follows this user.
 */
router.get('/follower/:username', async ctx => {
    ctx
        .validateParam('username')
        .required('Please specify the user.')
        .isString()
        .trim()

    const followers = await db_users.getFollowers(ctx.vals.username)
    followers.forEach(pre.presentFollower)

    await ctx.render('follow', {
        title: `${ctx.vals.username}'s Followers}`,
        followers: followers
    })
})

/**
 * Get the followees of an user, which means the people this user follows.
 */
router.get('/followee/:username', async ctx => {
    ctx
        .validateParam('username')
        .required('Please specify the user.')
        .isString()
        .trim()

    const followees = await db_users.getFollowees(ctx.vals.username)
    followees.forEach(pre.presentFollowee)

    await ctx.render('follow', {
        title: `${ctx.vals.username}'s Followees}`,
        followees: followees
    })
})

router.post('/follow', mw.ifLogin(), async ctx => {
    ctx.validateBody('followee')
        .required('Please specify the username of followee.')
        .isString()
        .trim()

    const exist = await db_users.existFollow(ctx.currUser.username, ctx.vals.followee)
    if (exist) {
        ctx.flash = {message : ["info", "Follow exist. Nothing updated."]}
        ctx.redirect('back')
    }
    await db_users.insertFollow(ctx.currUser.username, ctx.vals.followee)
    ctx.flash = {message : ["success", `Successfully follow user.`]}
    ctx.redirect('back')
})

module.exports = router