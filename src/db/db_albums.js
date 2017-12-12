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
 * Get the tracks of an album.
 *
 * @returns {Array<tracks>} rows
 */
exports.getTracksByAlbum = async function(album_id) {
    assert(typeof album_id === 'string')

    return pool.many(sql`
    SELECT * 
    FROM "album_contains" NATURAL JOIN "tracks"
    WHERE alid = ${album_id}
  `)
}
