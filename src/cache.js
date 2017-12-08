// 3rd
const IntervalCache = require('interval-cache')
// 1st
const db_tracks = require('./db/db_tracks')

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
    .start()
