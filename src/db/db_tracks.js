// 3rd
const assert = require('better-assert')
const uuid = require('uuid')

const { sql, _raw } = require('pg-extra')
const debug = require('debug')('app:db:tracks')
// 1st
const belt = require('../belt')
const config = require('../config')
const { pool } = require('./util')

/**
 * Get random 100 tracks.
 */
exports.getRandom100Tracks = async function () {
    return pool.many(sql`
    SELECT *
    FROM "tracks"  
    ORDER BY RANDOM()  
    LIMIT 20  
  `)
}

/**
 * Get the top 100 playing tracks.
 *
 * @returns {Array<tracks>} rows
 */
exports.getTop100Tracks = async function() {
    return pool.many(sql`
    SELECT * 
    FROM (SELECT tid, count(*) as counts FROM tracks_playing GROUP BY tid ORDER BY counts DESC LIMIT 20) 
        AS top100 NATURAL JOIN tracks
  `)
}

/**
 * Insert a record of track playing.
 *
 * @param username
 * @param tid
 * @returns {Promise<*>}
 */
exports.insertTracksPlaying = async function (username, tid) {
    assert(typeof username === 'string')
    assert(typeof tid === 'string')

    const datetime = (new Date()).toLocaleString()
    return pool.one(sql`
    INSERT INTO "tracks_playing" (username, tid, tptime)
    VALUES(${username}, ${tid}, ${datetime})
    RETURNING *
    `)
}

/**
 * Insert a record of playlist playing.
 *
 * @param username
 * @param playlist_id
 * @returns {Promise<*>}
 */
exports.insertPlaylistsPlaying = async function (username, playlist_id) {
    assert(typeof username === 'string')
    assert(typeof playlist_id === 'string')

    const datetime = (new Date()).toLocaleString()
    return pool.one(sql`
    INSERT INTO "playlists_playing" (username, pid, pptime)
    VALUES(${username}, ${playlist_id}, ${datetime})
    RETURNING *
    `)
}

/**
 * Insert an record into rating table.
 * @param username
 * @param tid
 * @param score
 * @returns {Promise<*>}
 */
exports.insertRating = async function (username, tid, score) {
    assert(typeof username === 'string')
    assert(typeof tid === 'string')
    assert(Number.isInteger(score))

    const datetime = (new Date()).toLocaleString()

    return pool.one(sql`
    INSERT INTO "rating" (username, tid, score, rtime)
    VALUES (${username}, ${tid}, ${score}, ${datetime})
    RETURNING *
    `)
}
