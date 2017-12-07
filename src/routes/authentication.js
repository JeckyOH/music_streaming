// 3rd party
const assert = require('better-assert')
const Router = require('koa-router')
const debug = require('debug')('app:routes:index')
// 1st party
const db_users = require('../db/db_users')
const mw = require('../middleware')
const config = require('../config')
const belt = require('../belt')

//
// These routes are concerned with registering, login, logout
//

const router = new Router()

// //////////////////////////////////////////////////////////

// Show login form
router.get('/login', async ctx => {
    await ctx.render('login', {
      title: 'Login',
      flash: ctx.flash
    })
})

// //////////////////////////////////////////////////////////

// Create login session
router.post('/login', async ctx => {
    // Validate

    ctx
        .validateBody('username')
        .required('Invalid creds')
        .isString()
        .trim()
    ctx
        .validateBody('password')
        .required('Invalid creds')
        .isString()
    //ctx.validateBody('remember-me').toBoolean()

    const user = await db_users.getUserByUname(ctx.vals.username)
    ctx.check(user, 'Invalid creds')
    ctx.check(
        await belt.checkPassword(ctx.vals.password, user.password),
        'Invalid creds'
    )

    ctx.cookies.set('username', ctx.vals.username, {
      expires:
      //ctx.vals['remember-me']
      //? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365):
      undefined
    })
    ctx.flash = { message: ['success', 'Logged in successfully'] }

    ctx.redirect('/')
})

// //////////////////////////////////////////////////////////

// Show register form
router.get('/register', async ctx => {
    await ctx.render('register', {
      title: 'Register',
      flash:ctx.flash
    })
})

// //////////////////////////////////////////////////////////

// Create user
router.post('/register', mw.ensureRecaptcha(), async ctx => {
    // Validation

    ctx
        .validateBody('username')
        .isString('Username required')
        .trim()
        .isLength(3, 15, 'Username must be 3-15 chars')
        .match(
            /^[a-z0-9_-]+$/i,
            'Username must only contain a-z, 0-9, underscore (_), or hypen (-)'
        )
        .match(/[a-z]/i, 'Username must contain at least one letter (a-z)')
        .checkNot(await db_users.getUserByUname(ctx.vals.username), 'Username taken')

    ctx
        .validateBody('password2')
        .isString('Password confirmation is required')
        .checkPred(s => s.length > 0, 'Password confirmation is required')

    ctx
        .validateBody('password1')
        .isString('Password is required')
        .checkPred(s => s.length > 0, 'Password is required')
        .isLength(6, 100, 'Password must be 6-100 chars')
        .eq(ctx.vals.password2, 'Password must match confirmation')

    // Insert user

    const user = await db_users.insertUser(
        ctx.vals.username,
        ctx.vals.password1
    )

    // Redirect to login page with the good news

    ctx.flash = { message: ['success', 'Successfully registered. Welcome!'] }
    ctx.redirect('/login')
})

// //////////////////////////////////////////////////////////

// Logout
router.del('/sessions/:id', async ctx => {
    // If user isn't logged in, give them the success case anyways
    if (!ctx.currUser) {
        ctx.flash = { message: ['success', 'You successfully logged out'] }
        ctx.redirect('/')
        return
    }
    ctx.validateParam('id')
    await db.logoutSession(ctx.currUser.id, ctx.vals.id)
    ctx.cookies.set('username', null)

    ctx.flash = { message: ['success', 'You successfully logged out'] }
    ctx.redirect('/')
})

// //////////////////////////////////////////////////////////

module.exports = router
