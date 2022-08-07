Array.prototype.__lgRandom = function () {
  return this[Math.floor((Math.random()*this.length))]
}

const LastFM = require('./client')

module.exports = new LastFM(
  `Lastgram/Core (v${__lgVersion.join('-')}; https://t.me/lastgramrobot)`
)
