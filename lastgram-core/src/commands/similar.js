module.exports = async (ctx) => {
  const type = ctx.args[0] ?? 'track'

  const d = await __lgCore.database.getLastFm(ctx.sender.id)
  if (!d) return __lgCore.common.reportNotRegistered(ctx, type)

  const a = await __lgCore.lfm.miscGetNPSimple(d)
  if (a && a.error || !a) return _t(ctx.lang, 'errors:fm')
  
  let similar
  let opts
  if (type.includes('artist')) {
    const b = await __lgCore.lfm.artistGetSimilar({ artist: a.artist })
    if (b && b.error || !b) return _t(ctx.lang, 'errors:fm')
    similar = b.artist.slice(0, 7).map(z => `  - [**${z.name}**](${z.url})`).join('\n')
    opts = { name: b['@attr'].artist, artist: null, url: a.url }
  } else {
    const b = await __lgCore.lfm.trackGetSimilar({ track: a.track, artist: a.artist })
    if (b && b.error || !b) return _t(ctx.lang, 'errors:fm')
    similar = b.track.slice(0, 7).map(z => `  - [**${z.name}**](${z.url}) - ${z.artist.name}`).join('\n')
    opts = { name: a.track, url: a.url, artist: b['@attr'].artist }
  }
  
  return _t(ctx.lang, 'fm:similar', { ...opts, similar })
}