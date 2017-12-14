// 3rd party
const assert = require('better-assert')
const router = require('koa-router')()
const debug = require('debug')('app:routes:index')
// 1st party
const db_tracks = require('../db/db_tracks')
const db_users = require('../db/db_users')
const db_artists = require('../db/db_artists')
const pre = require('../presenters')
const mw = require('../middleware')
const config = require('../config')
const belt = require('../belt')
const cache = require('../cache')

//
// The index.js routes file is mostly a junk drawer for miscellaneous
// routes until it's accumulated enough routes to warrant a new
// routes/*.js module.
//

// MIDDLEWARE

// expects /:uname param in url
// sets ctx.state.user
function loadUser() {
  return async (ctx, next) => {
    ctx.validateParam('uname')
    const user = await db.getUserByUname(ctx.vals.uname)
    ctx.assert(user, 404)
    pre.presentUser(user)
    ctx.state.user = user
    await next()
  }
}

// expects /:message_id param in url
// sets ctx.state.message
function loadMessage() {
  return async (ctx, next) => {
    ctx.validateParam('message_id')
    const message = await db.getMessageById(ctx.vals.message_id)
    ctx.assert(message, 404)
    pre.presentMessage(message)
    ctx.state.message = message
    await next()
  }
}

// //////////////////////////////////////////////////////////

// Useful route for quickly testing something in development
// 404s in production
router.get('/test', async ctx => {
  res = {
    name: "Hello",
    age: "world"
  }
  ctx.body = res
})

// //////////////////////////////////////////////////////////

// Show homepage
router.get('/', async ctx => {
  const random_tracks = await db_tracks.getRandom100Tracks()
  await ctx.render('index', {
      title: "Music Streaming Service",
      daily_tracks: random_tracks,
      top100_tracks: cache.get('top100_tracks'),
      top100_playlists: cache.get('top100_playlists'),
      popular_artists: cache.get('popular_artists'),
      popular_users: cache.get('popular_users')
  })
})

/**
 * Show Homepage after the user login.
 *
 * @ Params url '/homepage'
 */
router.get('/homepage', async ctx => {
  if (!ctx.currUser) {
    ctx.flash = { message: ['warning', 'Sorry, Please login in first.']}
    ctx.redirect('/login')
  }
  const recommend_users = await db_users.getRandom100Users()
  const moments = await db_users.getMomentByUsername(ctx.currUser.username)
    const friend_circle = await db_users.getFriendCircleByUsername(ctx.currUser.username)

  await ctx.render('homepage', {
    title: "Homepage",
      recommend_users: recommend_users,
      moments: moments,
      friend_circle: friend_circle
  })
})

router.get('/artist/:aid', async ctx => {
    ctx.validateParam('aid')
        .isString()
        .trim()

    const info = await db_artists.getArtistInfo(ctx.vals.aid)
    const tracks = await db_tracks.getTracksByArtist(ctx.vals.aid)
    tracks.forEach(pre.presentTracks)

    await ctx.render('artist', {
        basic_info: info,
        tracks: tracks
    })
})

module.exports = router
