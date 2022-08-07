module.exports = async (ctx) => {
  if (ctx.sender.id != '1889562226') return 'This command is under development. You cannot use it just yet.'
  const d = await __lgCore.database.getLastFm(ctx.sender.id)
  if (!d) return __lgCore.common.reportNotRegistered(ctx, type)

  const a = await __lgCore.lfm.miscGetNPSimple(d)
  if (a && a.error || !a) return _t(ctx.lang, 'errors:fm')
  const key = 'p6eo6eD5iRjK1_YFGhZQA_mSIG28JuPC'
  
  const b = await __lgCore.lfm.auth.trackLove(key, { track: a.track, artist: a.artist })
  console.log(b)
  if (b && b.error) return _t(ctx.lang, 'errors:fmAuth')
  
  return { content: _t(ctx.lang, 'fm:love.done', a), quote: true }
}