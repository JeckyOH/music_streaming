// Presents are functions that take data from the database
// and extend/improve it for the view layer. They're used in routes.
//
// For instance, a presenter would promote a string timestamp into
// a Date object which is more convenient for the view layer to work with.
//
// Example:
//
//     let user = presentUser(yield db.getUser(42))
//     this.assert(user, 404)
//     this.body = user

// //////////////////////////////////////////////////////////

exports.presentUser = function(x) {
  if (!x) return
  // Fix embedded json representation
  delete x.password
  x.url = `/profile/${x.username}`
  return x
}

// //////////////////////////////////////////////////////////

exports.presentSession = function(x) {
  if (!x) return
  // Fix embedded json representation
  if (typeof x.created_at === 'string') x.created_at = new Date(x.created_at)
  if (typeof x.expired_at === 'string') x.expired_at = new Date(x.expired_at)
  return x
}

// //////////////////////////////////////////////////////////

exports.presentMessage = function(x) {
  if (!x) return
  exports.presentUser(x.user)
  x.url = `/messages/${x.id}`
  return x
}

exports.presentTracks = function(x) {
    if (!x) return
    x.play_url = `/playtrack`
    x.open_url = ``
    return x
}

exports.presentAlbums = function(x) {
    if (!x) return
    x.open_url = `/album/${x.alid}`
    delete alid
    return x
}

exports.presentArtists = function(x) {
    if (!x) return
    x.open_url = ``
    return x
}

exports.presentPlaylists = function(x) {
    if (!x) return
    x.open_url = `/playlist/${x.pid}`
    return x
}

exports.presentFavorite = function (x) {
    if (!x) return
    x.open_url = ``
    return x
}

exports.presentFollower = function(x) {
    if (!x) return
    x.url = `/users/${x.follwer}`
    return x
}

exports.presentFollowee = function(x) {
    if (!x) return
    x.url = `/users/${x.follwee}`
    return x
}
