module.exports = async (ctx, smt, un) => {
  const [type, user] = __lgCore.common.getUserFromCtx(ctx)

  const d = un || await __lgCore.database.getLastFm(user.id)
  if (!d) return __lgCore.common.reportNotRegistered(ctx, type)

  const a = await __lgCore.lfm.miscGetNP(d)
  if (a && a.error) return _t(ctx.lang, 'errors:fm')
  if (!a) return __lgCore.common.reportNotRegistered(ctx, type)

  const content = {
    content: _t(ctx.lang, 'fm:ln', {
      name: (un ? d : user.name),
      ...a
    })
  }

  if (smt) return [content, { name: (un ? d : user.name), ...a }]
  return content
}
