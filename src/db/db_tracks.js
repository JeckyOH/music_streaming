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
 * Get the top 100 playing tracks.
 *
 * @returns {Array<tracks>} rows
 */
exports.getTop100Tracks = async function() {
    return pool.many(sql`
    SELECT * 
    FROM (SELECT tid, count(*) as counts FROM tracks_playing GROUP BY tid ORDER BY counts LIMIT 100) 
        AS top100 NATURAL JOIN tracks
  `)
}