module.exports = async (ctx) => {
  let track
  let artist
  if (ctx.args[0]) {
    const [t, a] = ctx.args.join(' ').split('-').map(z => z.trim())
    if (!t || !a) return _t(ctx.lang, 'fm:ti.malformed')
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
  
  const [_, sender] = __lgCore.common.getUserFromCtx(ctx, 1)
  const fm = await __lgCore.database.getLastFm(sender.id)
  const fmO = fm ? { user: fm } : {}
  
  const z = await __lgCore.lfm.trackGetInfo({ track, artist, lang: ctx.lang || 'en', autocorrect: 1, ...fmO })
  if (z?.error === 6) return _t(ctx.lang, 'fm:ti.notfound')
  else if (z?.error) return _t(ctx.lang, 'errors:fm')
  
  return { content: _t(ctx.lang, 'fm:ti.display', {
    name: z.name,
    artist: z.artist.name,
    album: z.album?.title,
    url: z.url,
    summary: (z.wiki?.summary || '').split(' <a ')[0].split('\n')[0],
    tags: ((z.toptags?.tag && z.toptags?.tag instanceof Array) ? z.toptags.tag : []).map(a => !isNaN(parseInt(a.name)) ? (a.name + 's') : a.name).slice(0, 5).map(a => '#'+ a.split(' ').join('_').split('-').join('_')).join(' '),
    userLoved: !!parseInt(z.userloved),
    userPlayCount: parseInt(z.userplaycount || 0),
    userMode: z.userplaycount,
    listeners: parseInt(z.listeners),
    playCount: parseInt(z.playcount)
  }), quote: true }
}