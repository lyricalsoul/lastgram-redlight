module.exports = async (ctx) => {
  let album
  let artist
  if (ctx.args[0]) {
    const [t, a] = ctx.args.join(' ').split('-').map(z => z.trim())
    if (!t || !a) return _t(ctx.lang, 'fm:albi.malformed')
    album = t
    artist = a
  } else {
    const [type, use] = __lgCore.common.getUserFromCtx(ctx)
    const d = await __lgCore.database.getLastFm(use.id)
    if (!d) return __lgCore.common.reportNotRegistered(ctx, type)

    const a = await __lgCore.lfm.miscGetNPSimple(d)
    if (a && a.error) return _t(ctx.lang, 'errors:fm')
    
    album = a.album
    artist = a.artist
  }
  
  const [_, sender] = __lgCore.common.getUserFromCtx(ctx, 1)
  const fm = await __lgCore.database.getLastFm(sender.id)
  const fmO = fm ? { user: fm } : {}
  
  const z = await __lgCore.lfm.albumGetInfo({ album, artist, lang: ctx.lang || 'en', autocorrect: 1, ...fmO })
  if (z?.error === 6) return _t(ctx.lang, 'fm:albi.notfound')
  else if (z?.error) return _t(ctx.lang, 'errors:fm')
  
  return { content: _t(ctx.lang, 'fm:albi.display', {
    name: z.name,
    artist: z.artist,
    url: z.url,
    summary: (z.wiki?.summary || '').split(' <a ')[0].split('\n')[0],
    tags: ((z.tags?.tag && z.tags?.tag instanceof Array) ? z.tags.tag : []).map(a => !isNaN(parseInt(a.name)) ? (a.name + 's') : a.name).slice(0, 5).map(a => '#'+ a.split(' ').join('_').split('-').join('_')).join(' '),
    userPlayCount: parseInt(z.userplaycount || 0),
    userMode: z.userplaycount,
    trackCount: z.tracks?.track?.length,
    listeners: parseInt(z.listeners),
    playCount: parseInt(z.playcount)
  }), quote: true }
}