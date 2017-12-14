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

    await ctx.render('follower', {
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

    await ctx.render('followee', {
        title: `${ctx.vals.username}'s Followees}`,
        followees: followees
    })
})

/**
 * Follow an user.
 */
router.post('/follow', mw.ifLogin(), async ctx => {
    ctx.validateBody('followee')
        .required('Please specify the username of followee.')
        .isString()
        .trim()

    if (ctx.vals.followee == ctx.currUser.username) {
        ctx.response.status = 400
        ctx.body = "Do not follow yourself."
    }
    else {
        const exist = await db_users.existFollow(ctx.currUser.username, ctx.vals.followee)
        if (exist) {
            ctx.response.status = 400
            ctx.body = "This user has already been followed."
        }
        else {
            await db_users.insertFollow(ctx.currUser.username, ctx.vals.followee)
            ctx.response.status = 200
        }
    }
})

/**
 * Unfollow an user.
 */
router.post('/unfollow', mw.ifLogin(), async ctx => {
    ctx.validateBody('followee')
        .required('Please specify the username of followee.')
        .isString()
        .trim()

    await db_users.deleteFollow(ctx.currUser.username, ctx.vals.followee)

    ctx.flash = {message: ["success", "Successfully unfollow."]}
    ctx.redirect('back')
})

module.exports = router