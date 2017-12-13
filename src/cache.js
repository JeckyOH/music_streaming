// 3rd
const IntervalCache = require('interval-cache')
// 1st
const db_tracks = require('./db/db_tracks')
const db_playlists = require('./db/db_playlists')
const db_users = require('./db/db_users')
const db_artists = require('./db/db_artists')

//
// Some things are too wasteful to calculate on every request,
// but too trivial to extract into a real caching layer.
// e.g. SELECT COUNT(*)
// For these things, a setInterval on each server gets the job
// done.
//

// //////////////////////////////////////////////////////////

module.exports = new IntervalCache()
    .every('top100_tracks', 1000 * 60, db_tracks.getTop100Tracks, [])
    .every('top100_playlists', 1000 * 60, db_playlists.getTop100Playlists, [])
    .every('popular_artists', 1000 * 60, db_artists.getPopularArtists, [])
    .every('popular_users', 1000 * 60, db_users.getPopularUsers, [])
    .start()
