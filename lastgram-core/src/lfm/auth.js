const md5 = require('crypto-js/md5')

module.exports = class Auth {
  constructor (client) {
    this.client = client
  }
  
  trackLove(sk, options) {
    return this.wrequest({ method: 'track.love', sk, ...options }, null)
  }
  
  trackUnlove(sk, options) {
    return this.wrequest({ method: 'track.unlove', sk, ...options }, null)
  }
  
  getSession(token) {
    return this.request({ method: 'auth.getSession', token }, 'session')
  }
  
  get authURL () {
    return `https://www.last.fm/api/auth/?api_key=${process.env.WEB_FM_KEY}`
  }
  
  cbAuthURL (cb) {
    return this.authURL + '&cb='+ cb
  }
  
  generateSignature (options) {
    const keys = Object.keys(options)
      .sort((a, b) => a.localeCompare(b))
      .map((z) => `${z}${options[z]}`)
      .join('')

    return md5(keys + process.env.WEB_FM_SECRET).toString()
  }
  
  request (props, obj, sign = true) {
    props.api_key = process.env.WEB_FM_KEY
    const sig = sign ? { api_sig: this.generateSignature(props) } : {}
    
    return this.client.request({ ...props, ...sig }, obj, 'GET', false)
  }
  
  wrequest (props, obj, sign = true) {
    props.api_key = process.env.WEB_FM_KEY
    const sig = sign ? { api_sig: this.generateSignature(props) } : {}
    
    return this.client.request({ ...props, ...sig }, obj, 'POST', false)
  }
}
