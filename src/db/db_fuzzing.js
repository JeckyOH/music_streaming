// 3rd
const assert = require('better-assert')
const uuid = require('uuid')

const { sql, _raw } = require('pg-extra')
const debug = require('debug')('app:db:fuzzing')
// 1st
const belt = require('../belt')
const config = require('../config')
const { pool } = require('./util')

/**
 * Get the tracks according to the keyword. May involves the ttitle, tgenre.
 */
exports.getTracksByKeyword = async function(keyword, limit = 'ALL', offset = 0){
    return pool.many(sql `
    SELECT * 
    FROM tracks
    WHERE ttitle LIKE ${'%' + keyword + '%'} or tgenre LIKE ${'%' + keyword + '%'}
    LIMIT ${limit} OFFSET ${offset}
    `)
}

/**
 * Get the albums according to the keyword. May involves the altitle.
 */
exports.getAlbumsByKeyword = async function(keyword, limit = 'ALL', offset = 0){
    return pool.many(sql `
    SELECT * 
    FROM albums
    WHERE altitle LIKE ${'%' + keyword + '%'}
    LIMIT ${limit} OFFSET ${offset}
    `)
}

/**
 * Get the artists according to the keyword. May involves the aname, adesc.
 */
exports.getArtistsByKeyword = async function(keyword, limit = 'ALL', offset = 0){
    return pool.many(sql `
    SELECT * 
    FROM artists
    WHERE aname LIKE ${'%' + keyword + '%'} or adesc LIKE ${'%' + keyword + '%'}
    LIMIT ${limit} OFFSET ${offset}
    `)
}

/**
 * Get the artists according to the keyword. May involves the username, uname, uemail, ucity.
 */
exports.getUsersByKeyword = async function(keyword, limit = 'ALL', offset = 0){
    return pool.many(sql `
    SELECT * 
    FROM users
    WHERE username LIKE ${'%' + keyword + '%'} or uname LIKE ${'%' + keyword + '%'} or uemail LIKE ${'%' + keyword + '%'} or ucity LIKE ${'%' + keyword + '%'}
    LIMIT ${limit} OFFSET ${offset}
    `)
}

/**
 * get the playlists according to the keyword.
 * @param keyword
 * @param limit
 * @param offset
 * @returns {Promise<*>}
 */
exports.getPlaylistByKeyword = async function (keyword, limit = 'ALL', offset = 0) {
    return pool.many(sql`
    SELECT *
    FROM "playlists"
    WHERE ptitle LIKE ${'%'+ keyword + '%'} 
    LIMIT ${limit} OFFSET ${offset}
    `)
}

