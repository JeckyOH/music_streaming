// 3rd
const assert = require('better-assert')
const uuid = require('uuid')

const { sql, _raw } = require('pg-extra')
const debug = require('debug')('app:db:users')
// 1st
const belt = require('../belt')
const config = require('../config')
const { pool } = require('./util')

// Case-Sensitive uname lookup
exports.getUserByUname = async function(uname) {
    assert(typeof uname === 'string')
    return pool.one(sql`
    SELECT *
    FROM "User"
    WHERE username = ${uname}
  `)
}

// //////////////////////////////////////////////////////////

// Returns created user record
//
// email is optional
exports.insertUser = async function(uname, password) {
    assert(typeof uname === 'string')
    assert(typeof password === 'string')
    const digest = await belt.hashPassword(password)
    return pool.one(sql`
    INSERT INTO "User" (username, password)
    VALUES (${uname}, ${digest})
    RETURNING *
  `)
}
