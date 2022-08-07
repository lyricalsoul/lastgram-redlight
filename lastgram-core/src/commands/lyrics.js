const { getSong } = require('genius-lyrics-api')
const payload = {
  optimizeQuery: true,
  apiKey: process.env.GENIUS_ACCESS_TOKEN
}

module.exports = async (ctx) => {
  let track
  let artist
  if (ctx.args[0]) {
    const [t, a] = ctx.args.join(' ').split('-').map(z => z.trim())
    if (!t || !a) return _t(ctx.lang, 'fm:lyrics.malformed')
    track = t
    artist = a
  } else {
    const [type, use] = __lgCore.common.getUserFromCtx(ctx)
    const d = await __lgCore.database.getLastFm(use.id)
    if (!d) return __lgCore.common.reportNotRegistered(ctx, type)

    const a = await __lgCore.lfm.miscGetNPSimple(d)
    if (a && a.error) return _t(ctx.lang, 'errors:fm')
    
    track = a.track
    artist = a.artist
  }
  const data = { ...payload, title: track, artist }
  
  const r = await getSong(data).catch(() => null)
  if (!r || !r.lyrics) return _t(ctx.lang, 'fm:lyrics.notfound')
  if (r.lyrics.length > 3800) r.lyrics = r.lyrics.substring(0, 3800) + '...\n' + _t(ctx.lang, 'fm:lyrics.didntFit')
  
  r.lyrics = r.lyrics.escapeAll().split('[').join('**[').split(']').join(']**')
  return _t(ctx.lang, 'fm:lyrics.display', r)
}