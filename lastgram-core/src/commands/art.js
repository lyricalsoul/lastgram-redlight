module.exports = async (ctx) => {
  const [type, user] = __lgCore.common.getUserFromCtx(ctx)

  const d = await __lgCore.database.getLastFm(user.id)
  if (!d) return __lgCore.common.reportNotRegistered(ctx, type)

  const a = await __lgCore.lfm.miscGetNP(d, 'artist')
  if (a && a.error) {
    __lgCore.notifier().reportError(a.error, `${ctx.platform};${ctx.channel};${ctx.sender.name}`)
    return _t(ctx.lang, 'errors:fm')
  }
  
  if (!a) return __lgCore.common.reportNotRegistered(ctx, type)

  return {
    content: _t(ctx.lang, 'fm:art', {
      name: user.name,
      ...a
    }),
    image: a?.cover
  }
}
