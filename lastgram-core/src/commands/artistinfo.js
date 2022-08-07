module.exports = async (ctx) => {
  let artist
  if (ctx.args[0]) {
    artist = ctx.args.join(' ')
  } else {
    const [type, use] = __lgCore.common.getUserFromCtx(ctx)
    const d = await __lgCore.database.getLastFm(use.id)
    if (!d) return __lgCore.common.reportNotRegistered(ctx, type)

    const a = await __lgCore.lfm.miscGetNPSimple(d)
    if (a && a.error) return _t(ctx.lang, 'errors:fm')
    
    artist = a.artist
  }
  
  const [_, sender] = __lgCore.common.getUserFromCtx(ctx, 1)
  const fm = await __lgCore.database.getLastFm(sender.id)
  const fmO = fm ? { user: fm } : {}
  
  const z = await __lgCore.lfm.artistGetInfo({ artist, lang: ctx.lang || 'en', autocorrect: 1, ...fmO })
  if (z?.error === 6) return _t(ctx.lang, 'fm:arti.notfound')
  else if (z?.error) return _t(ctx.lang, 'errors:fm')
  
  return { content: _t(ctx.lang, 'fm:arti.display', {
    name: z.name,
    url: z.url,
    summary: (z.bio?.summary   || '').split(' <a ')[0].split('\n')[0],
    tags: ((z.tags?.tag && z.tags?.tag instanceof Array) ? z.tags.tag : []).map(a => !isNaN(parseInt(a.name)) ? (a.name + 's') : a.name).slice(0, 5).map(a => '#'+ a.split(' ').join('_').split('-').join('_')).join(' '),
    userPlayCount: parseInt(z.stats.userplaycount || 0),
    onTour: !!parseInt(z.ontour || 0),
    similarArtists: z.similar.artist.filter(a => !a.name.includes(z.name)).slice(0,4).map(z => z.name).join(', '),
    listeners: parseInt(z.stats.listeners),
    playCount: parseInt(z.stats.playcount),
    userMode: z.stats?.userplaycount
  }), quote: true }
}