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
    FROM "users"
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
    INSERT INTO "users" (username, password)
    VALUES (${uname}, ${digest})
    RETURNING *
  `)
}

/**
 * Update the user`s basic information.
 */
exports.updateUserBasicInfo = async function(username, fields) {
    assert(typeof username === 'string')
    const WHITELIST = ['uname', 'uemail', 'ucity']
    assert(Object.keys(fields).every(key => WHITELIST.indexOf(key) > -1))
    return pool.one(sql`
    UPDATE "users"
    SET uemail = ${fields.uemail}, uname = ${fields.uname}, ucity = ${fields.ucity}
    WHERE username = ${username}
    RETURNING *
  `)
}

/**
 * Update the user`s password.
 */
exports.updateUserBasicInfo = async function(username, password) {
    assert(typeof username === 'string')
    assert(typeof password === 'string')
    const digest = await belt.hashPassword(password)
    return pool.one(sql`
    UPDATE "users"
    SET password = ${digest}
    RETURNING *
  `)
}
