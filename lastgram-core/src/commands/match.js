module.exports = async (ctx) => {
  const [type, sender] = __lgCore.common.getUserFromCtx(ctx, 1)
  const [typeU, user] = __lgCore.common.getUserFromCtx(ctx, 2)
  if (user.id === sender.id) return _t(ctx.lang, 'fm:compat.same')
  if (!typeU) return __lgCore.common.reportNoneMentioned(ctx)
  const two = await __lgCore.database.getLastFm(user.id)
  if (!two) return __lgCore.common.reportNotRegistered(ctx, typeU)

  const one = await __lgCore.database.getLastFm(sender.id)
  if (!one) return __lgCore.common.reportNotRegistered(ctx, type)

  const a = await __lgCore.lfm.compat.generate(one, two)
  if (!a) return _t(ctx.lang, 'errors:fm')
  const [perc, artists] = a
  return {
    content: _t(ctx.lang, 'fm:compat.result', {
      name: user.name,
      perc,
      artists
    })
  }
}
