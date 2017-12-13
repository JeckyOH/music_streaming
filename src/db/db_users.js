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

/**
 * Insert a follow relationship.
 * @param follower
 * @param followee
 * @returns {Promise<*>}
 */
exports.insertFollow = async function (follower, followee) {
    assert(typeof follower === 'string')
    assert(typeof followee === 'string')

    const date = (new Date()).toLocaleDateString()

    return pool.one(sql`
    INSERT INTO "follow" (follower_usrname, followee_usrname, fldate)
    VALUE (${follower}, ${followee}, ${date})
    RETURNING *
    `)
}

/**
 * Delete a follow relationship.
 * @param follower
 * @param followee
 * @returns {Promise<*>}
 */
exports.deleteFollow = async function (follower, followee) {
    assert(typeof follower === 'string')
    assert(typeof followee === 'string')

    return pool.one(sql`
    DELETE FROM "follow" 
    WHERE follower_usr = ${follower} and followee_usrname = ${followee}
    `)
}

/**
 * Get followers of an user, which means the people who follows this user.
 * @param followee
 * @returns {Promise<*>}
 */
exports.getFollowers = async function (followee) {
    assert(typeof follwee === 'string')

    return pool.many(sql`
    SELECT follower_usrname as follower, fldate
    FROM "follow"
    WHERE followee_usrname = ${followee}
    `)
}

/**
 * Get followees of an user, which means the people this user follows.
 * @param follower
 * @returns {Promise<*>}
 */
exports.getFollowees = async function (follower) {
    assert(typeof follwer === 'string')

    return pool.many(sql`
    SELECT followee_usrname as followee, fldate
    FROM "follow"
    WHERE follower_usrname = ${follower}
    `)
}

exports.existFollow = async function (follower, followee) {
    assert(typeof follower === 'string')
    assert(typeof followee === 'string')

    res = await pool.one(sql`
    SELECT * 
    FROM "follow"
    WHERE follower_usrname = ${follower} and followee_usrname = ${followee}
    `)
    if(res) return true
    return false
}




