// 3rd
const assert = require('better-assert')
const uuid = require('uuid')

const { sql, _raw } = require('pg-extra')
const debug = require('debug')('app:db:albums')
// 1st
const belt = require('../belt')
const config = require('../config')
const { pool } = require('./util')

/**
 * Get the top 100 playing playlists.
 *
 * @returns {Array<tracks>} rows
 */
exports.getTop100Playlists = async function() {
    return pool.many(sql`
    SELECT * 
    FROM (SELECT pid, count(*) as counts FROM playlists_playing GROUP BY pid ORDER BY counts DESC LIMIT 100) 
        AS top100 NATURAL JOIN playlists
    WHERE playlists.pstatus = 'public'
  `)
}

/**
 * Get the playlist by pid.
 * @param pid
 * @returns {Promise<*>}
 */
exports.getPlaylistByPid = async function (pid) {
    assert(typeof pid === 'string')
    return pool.one(sql`
    SELECT *
    FROM "playlists"
    WHERE pid = ${pid}
    `)
}

/**
 * Get the playlist by username.
 *
 * @returns {Array<tracks>} rows
 */
exports.getPlaylistByUsername = async function(username) {
    assert(typeof username === 'string')

    return pool.many(sql`
    SELECT * 
    FROM "playlists"
    WHERE username = ${username}
  `)
}

/**
 * Get the tracks of an playlists.
 *
 * @returns {Array<tracks>} rows
 */
exports.getTracksByPlaylist = async function(playlist_id) {
    assert(typeof playlist_id === 'string')

    return pool.many(sql`
    SELECT * 
    FROM "playlist_contains" NATURAL JOIN "tracks"
    WHERE pid = ${playlist_id}
  `)
}

/**
 * Create a playlist.
 * @param {Object} playlist
 * {string} pid
 * {string} username
 * {string} pstatus || "public"
 * {string} ptitle || "default"
 *
 * @returns {Array<tracks>} rows
 */
exports.insertPlaylist = async function(playlist) {
    pid = playlist.pid
    username = playlist.username
    pstatus = playlist.pstatus || 'public'
    pdate = (new Data()).toLocaleString()
    ptitle = playlist.ptitle || 'default'

    assert(typeof pid === 'string')
    assert(typeof username === 'string')
    assert(typeof pstatus === 'string')
    assert(typeof ptitle === 'string')

    return pool.one(sql`
    INSERT INTO "playlists" (pid, ptitle, pstatus, pcreatedate, pmodifydate, username)
    VALUES (${pid}, ${ptitle}, ${pstatus}, ${pdate}, ${pdate}, ${username})
    RETURNING *
  `)
}

/**
 * delete a playlist.
 * @param {string} playlist_id
 */
exports.deletePlaylist = async function(playlist_id) {
    assert(typeof playlist_id === 'string')

    return pool.one(sql`
    DELETE FROM "playlists"
    WHERE pid = ${playlist_id}
  `)
}

/**
 * clear the tracks in a playlist.
 * @param {string} playlist_id
 */
exports.clearTracksOfPlaylist = async function(playlist_id) {
    assert(typeof playlist_id === 'string')

    return pool.one(sql`
    DELETE FROM "playlist_contains"
    WHERE pid = ${playlist_id}
  `)
}

/**
 * Check whether a playlist has already had a track.
 *
 * @param playlist_id
 * @param tid
 * @returns {Promise<void>}
 */
exports.existPlaylistContains = async function (playlist_id, tid) {
    assert(typeof playlist_id === 'string')
    assert(typeof tid === 'string')

    res = await pool.one(sql`
    SELECT * 
    FROM "playlist_contains"
    WHERE pid = ${playlist_id} and tid = ${tid}
    `)
    if(res) return true
    return false
}

exports.getMaxInPlaylist = async function (playlist_id) {
    assert(typeof playlist_id === 'string')

    const { max } = await pool.one(sql`
    SELECT MAX(sequence_in_playlist) AS "max"
    FROM "playlist_contains"
    WHERE pid = ${playlist_id}
  `)
    return count
}

exports.checkOwnership = async function (playlist_id, username) {
    assert(typeof playlist_id === 'string')
    assert(typeof username === 'string')

    const {res_username} = pool.one(sql`
    SELECT username
    FROM "playlists"
    WHERE pid = ${playlist_id}
  `)
    if (res_username && (username == res_username) ) return true
    return false
}

/**
 * Insert into playlist_contains.
 * @param playlist_id
 * @param tid
 */
exports.insertPlaylistContains = async function (playlist_id, tid) {
    assert(typeof playlist_id === 'string')
    assert(typeof tid === 'string')

    const max = await exports.getMaxInPlaylist(playlist_id)

    return pool.one(sql`
    INSERT INTO "playlist_contains" (pid, tid, sequence_in_playlist)
    VALUES (${playlist_id}, ${tid}, ${max + 1})
    RETURNING *
  `)
}

/**
 * Delete a track from a playlist.
 *
 * @param playlist_id
 * @param tid
 * @returns {Promise<void>}
 */
exports.deletePlaylistContains = async function (playlist_id, tid) {
    assert(typeof playlist_id === 'string')
    assert(typeof tid === 'string')

    return pool.one(sql`
    DELETE FROM "playlist_contains"
    WHERE pid = (${playlist_id} and tid = ${tid}
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
