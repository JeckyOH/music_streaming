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

