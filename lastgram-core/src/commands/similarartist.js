module.exports = async (ctx) => {
  const d = await __lgCore.database.getLastFm(ctx.sender.id)
  if (!d) return __lgCore.common.reportNotRegistered(ctx, type)

  const a = await __lgCore.lfm.miscGetNPSimple(d)
  if (a && a.error || !a) return _t(ctx.lang, 'errors:fm')
  
  const b = await __lgCore.lfm.artistGetSimilar({ artist: a.artist })
  if (b && b.error || !b) return _t(ctx.lang, 'errors:fm')

  let similar = b.artist.slice(0, 7).map(z => `  - [**${z.name}**](${z.url})`).join('\n')
  let opts = { name: b['@attr'].artist, url: a.url }
 
  return _t(ctx.lang, 'fm:similar', { ...opts, similar, artist: null })
}