// 3rd
const assert = require('better-assert')
const uuid = require('uuid')

const { sql, _raw } = require('pg-extra')
const debug = require('debug')('app:db:users')
// 1st
const belt = require('../belt')
const config = require('../config')
const { pool } = require('./util')

/**
 * Get top 100 popular artists, which means these artists are favorited by most people.
 * @returns {Promise<*>}
 */
exports.getPopularArtists = async function () {
    return pool.many(sql`
    SELECT * 
    FROM (SELECT aid, count(*) as counts FROM "favorite" GROUP BY aid ORDER BY counts DESC LIMIT 100) 
        AS top100 NATURAL JOIN artists
  `)
}

exports.getFavoritesByUsername = async function (username) {
    assert(typeof username === 'string')
    return pool.many(sql`
    SELECT aid, aname, adesc, frdate
    FROM "favorite" NATURAL JOIN "artists"
    WHERE username = ${username}
    `)
}

/**
 * Insert a record of favorite.
 * @param username {string}
 * @param aid {string}
 * @returns {Promise<*>}
 */
exports.insertFavorite = async function (username, aid) {
    assert(typeof username === 'string')
    assert(typeof aid === 'string')

    const date = (new Date()).toLocaleDateString()

    return pool.one(sql`
    INSERT INTO "favorite" (username, aid, frdate)
    VALUE (${username}, ${aid}, ${date})
    RETURNING *
    `)
}

/**
 * Check if there is such a favorite record.
 *
 * @param username {string}
 * @param aid {string}
 * @returns {Promise<boolean>}
 */
exports.existFavorite = async function (username, aid) {
    assert(typeof username === 'string')
    assert(typeof aid === 'string')

    const res = await pool.one(sql`
    SELECT *
    FROM "favorite"
    WHERE username = ${username} and aid = ${aid}
    `)

    if (res) return true
    return false
}