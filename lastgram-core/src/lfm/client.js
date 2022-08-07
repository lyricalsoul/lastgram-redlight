const fetch = require('node-fetch')
const Auth = require('./auth')
const Compat = require('./compat')
const API_URL = 'http://ws.audioscrobbler.com/2.0/'
const EMPTY_ARTIST = 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'
const toQueryString = (obj, encode = true) => Object.keys(obj).map(k => `${k}=${encode ? encodeURIComponent(obj[k]) : obj[k]}`).join('&')

module.exports = class LastFM {
  constructor (useragent) {
    this.userAgent = useragent
    this.auth = new Auth(this)
    this.compat = new Compat(this)
  }

  userGetRecentTracks (user, other) {
    return this.request({ method: 'user.getRecentTracks', user, ...other }, 'recenttracks')
  }
  
  userGetInfo (user, other) {
    return this.request({ method: 'user.getInfo', user, ...other }, 'user')
  }

  userGetTopArtists (user, other, period = 'overall') {
    return this.request({ period: period, method: 'user.getTopArtists', user, ...other }, 'topartists')
  }

  artistGetSimilar (options) {
    return this.request({ method: 'artist.getSimilar', ...options }, 'similarartists')
  }
  
  trackGetSimilar (options) {
    return this.request({ method: 'track.getSimilar', ...options }, 'similartracks')
  }

  trackGetInfo (options) {
    return this.request({ method: 'track.getInfo', ...options }, 'track')
  }

  albumGetInfo (options) {
    return this.request({ method: 'album.getInfo', ...options }, 'album')
  }

  artistGetInfo (options) {
    return this.request({ method: 'artist.getInfo', ...options }, 'artist')
  }

  get apiKey () {
    return {
      api_key: process.env.FM_KEY.split(',').__lgRandom()
    }
  }

  request (props, obj, method = 'GET', addApiKey = true) {
    props.format = 'json'
    const body = toQueryString({ ...props, ...(addApiKey ? this.apiKey : {}) })
    const url = method === 'GET'
      ? `${API_URL}?${body}`
      : `${API_URL}?format=json`

    const headers = {
      'User-Agent': this.userAgent,
      'Content-Type': method === 'GET' ? 'application/json' : 'application/x-www-form-urlencoded'
    }
    const extra = method !== 'GET' ? { body } : {}
    /*console.log(url)
    console.log(extra)
    console.log(method)*/
    return fetch(url, {
      method,
      headers,
      ...extra
    })
      .then(res => res.text())
      .then(text => {
        if (!text.startsWith('{')) return { error: text }
        const a = JSON.parse(text)
        return (obj && a[obj]) || a
      })
  }

  async miscListLastTracks (user, limit = 4) {
    const a = await this.userGetRecentTracks(user, { limit, extended: 1 })
    if (a.error) return { error: a.error }
    let list = []
    a.track.forEach((z, index) => {
      list.push(`   ${parseInt(z.loved || 0) ? '❤️': '🎵'}${((a.track.length === limit + 1) && index === 0) ? '▶️' : ''} **${z.name}** - ${z.artist.name} [${z.album['#text']}]`)
    })
    return list
  }

  async miscGetNPSimple (user) {
    const a = await this.userGetRecentTracks(user, { limit: 1, extended: 0 })
    if (a.error) return { error: a.error }
    if (!a.track?.[0]) return null
    const [track] = a.track
    return { track: track.name, artist: track.artist.name || track.artist['#text'], album: track.album.name || track.album['#text'], url: track.url }
  }
  
  async miscGetNP (user, type = 'track', secUser) {
    const a = await this.userGetRecentTracks(user, { limit: 1, extended: 0 })
    if (a.error) return { error: a.error }
    if (!a.track?.[0]) return null

    const c = {}
    const artist = a.track[0].artist.name || a.track[0].artist['#text']

    c.artist = artist

    c.username = user

    let obj = {
      artist,
      isPlaying: (a.track[0]['@attr']?.nowplaying === 'true'),
      cover: (a.track[0].image[3] || a.track[0].artist.image[3])['#text']
    }

    if (type === 'track' || type === 'npfull') {
      c.username = secUser || user
      const b = await this.trackGetInfo({ ...c, track: a.track[0].name })
      obj = {
        ...obj,
        track: a.track[0].name,
        album: a.track[0].album['#text'],
        tags: (b?.toptags?.tag || [])?.map?.(z => z.name) || [],
        playCount: parseInt(b.userplaycount || (secUser ? 0 : -1)),
        loved: parseInt(b.userloved || 0)
      }
      if (type === 'npfull') {
        obj = {
          ...obj,
          rest: a.track.map(z => [
            z.artist.name || z.artist['#text'],
            z.name,
            z.album['#text']
          ])
        }
      }
    }

    if (type === 'album') {
      c.username = secUser || user
      const b = await this.albumGetInfo({ ...c, album: a.track[0].album['#text'] })
      obj = {
        ...obj,
        album: a.track[0].album['#text'],
        tags: (b?.tags?.tag || [])?.map?.(z => z.name) || [],
        playCount: parseInt(b.userplaycount || (secUser ? 0 : -1))
      }
    }

    if (type === 'artist') {
      c.username = secUser || user
      const b = await this.artistGetInfo({ ...c, track: a.track[0].artist['#text'] })
      const artCover = b?.image?.[3]?.['#text']
      obj = {
        ...obj,
        cover: (artCover && artCover !== EMPTY_ARTIST) ? artCover : obj.cover,
        tags: (b?.tags?.tag || [])?.map?.(z => z.name) || [],
        playCount: parseInt(b.stats?.userplaycount || (secUser ? 0 : -1))
      }
    }

    if (obj.tags) obj.tags = obj.tags.map(l => l.split('-').join('_'))
    return obj
  }
}
