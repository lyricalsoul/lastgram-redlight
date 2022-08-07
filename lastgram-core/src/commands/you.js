module.exports = async (ctx) => {
  const [typeU, user] = __lgCore.common.getUserFromCtx(ctx, 2)
  if (!typeU) return __lgCore.common.reportNoneMentioned(ctx)
  const two = await __lgCore.database.getLastFm(user.id)
  if (!two) return __lgCore.common.reportNotRegistered(ctx, typeU)

  if (ctx.args[0]) {
    if (['art', 'artist', 'artista'].includes((ctx.args[0]))) return __lgCore.getCommand('youart')(ctx)
    if (['alb', 'album'].includes((ctx.args[0]))) return __lgCore.getCommand('youalb')(ctx)
  }

  const [type, sender] = __lgCore.common.getUserFromCtx(ctx, 1)
  const one = await __lgCore.database.getLastFm(sender.id)
  if (!one) return __lgCore.common.reportNotRegistered(ctx, type)

  const a = await __lgCore.lfm.miscGetNP(one, 'track', two)
  if (a && a.error) return _t(ctx.lang, 'errors:fm')

  return {
    content: _t(ctx.lang, 'fm:lnOther.track', {
      name: user.name,
      ...a
    }),
    image: a?.cover
  }
}
