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
 * Get the profile of an user.
 */
router.get('/profile/:username', async ctx => {
    ctx.validateParam('username')
        .required('Please specify the user.')
        .isString()
        .trim()

    const basic_info = await db_users.getUserByUname(ctx.vals.username)
    pre.presentUser(basic_info)

    //TODO Get follow favirote rating etc.

    await ctx.render('profile', {
        basic_info: basic_info,
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
        .isString()
        .trim()

    ctx
        .validateBody('uemail')
        .isString()
        .trim()
    ctx
        .validateBody('uname')
        .isString()
        .trim()
    if (ctx.vals.email) {
        ctx.validateBody('email').isEmail()
    }

    if(ctx.currUser.username !== ctx.vals.username){
        ctx.flash = { message: ['error', 'Editing other`s profile is not allowed.'] }
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