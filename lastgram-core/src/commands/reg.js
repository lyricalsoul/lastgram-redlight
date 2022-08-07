module.exports = async (ctx) => {
  if (!ctx.args[0]) return _t(ctx.lang, 'fm:reg.missing')
  const s = ctx.args[0].replace('<', '').replace('>', '').split('/')
  ctx.args[0] = s[s.length - 1].replace('@', '')
  const z = await __lgCore.lfm.miscGetNP(ctx.args[0])
  if (z?.error === 6) return _t(ctx.lang, 'fm:reg.notfound')
  else if (z?.error) return _t(ctx.lang, 'errors:fm')

  if (await __lgCore.database.getLastFm(ctx.sender.id)) {
    await __lgCore.database.updateUser(ctx.sender.id, { lfm_username: ctx.args[0] })
  } else {
    await __lgCore.database.createUser(ctx.sender.id, ctx.args[0])
  }
  return _t(ctx.lang, 'fm:reg.ok', { username: ctx.args[0] })
}
