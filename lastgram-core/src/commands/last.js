const { flag } = require('country-emoji')

module.exports = async (ctx) => {
  let user = {}
  if (ctx.args[0]) {
    const s = ctx.args[0].replace('<', '').replace('>', '').split('/')
    user.name = s[s.length - 1].replace('@', '')
    user.fm = s[s.length - 1].replace('@', '')
  } else {
    const [type, use] = __lgCore.common.getUserFromCtx(ctx)
    const d = await __lgCore.database.getLastFm(use.id)
    if (!d) return __lgCore.common.reportNotRegistered(ctx, type)
    user.name = use.name
    user.fm = d
  }
  const z = await __lgCore.lfm.userGetInfo(user.fm)
  if (z?.error === 6) return _t(ctx.lang, 'fm:reg.notfound')
  else if (z?.error) return _t(ctx.lang, 'errors:fm')
  
  const x = await __lgCore.lfm.miscListLastTracks(user.fm)
  if (x?.error) return _t(ctx.lang, 'errors:fm')
  
  const date = new Date(parseInt(z.registered.unixtime) * 1000)
  
  const aa = new Date()
  const fullName = z.realname || (ctx.args[0] ? z.name : user.name)
  let secondaryName = !ctx.args[0] ? user.name : ''
  if (fullName === secondaryName) secondaryName = undefined
  return _t(ctx.lang, 'fm:info.display', {
    date,
    showUser: !!ctx.args[0],
    fullName,
    secondaryName,
    userName: z.name || '',
    scrobbles: z.playcount,
    trackList: x[0] ? x.join('\n') : '🍃',
    flagEmoji: flag(z.country) ?? ''
  })
}