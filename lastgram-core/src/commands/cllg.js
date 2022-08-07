const sleep = (ms) => new Promise(r => setTimeout(r, ms))
module.exports = async (ctx) => {
  const [typeu, user] = __lgCore.common.getUserFromCtx(ctx)

  const d = await __lgCore.database.getLastFm(user.id)
  if (!d) return __lgCore.common.reportNotRegistered(ctx, typeu)

  const fullArgs = ctx.args
  const fullArgsJoined = ctx.args.join(' ')
  const [x, y] = fullArgs.filter(a => a.toLowerCase().includes('x'))[0]?.toLowerCase?.()?.split?.('x') ?? [3, 3]
  if (x > 10 || y > 10) return _t(ctx.lang, 'fm:cllg.huge')
  let type = 'album'
  let period = 'overall'
  let flags = ''
  if (fullArgsJoined.includes('artist')) type = 'artist'
  if (fullArgsJoined.includes('album')) type = 'album'
  if (fullArgsJoined.includes('track')) type = 'track'
  if (fullArgsJoined.includes('notext') || fullArgsJoined.includes('nolabel')) flags += 'nolabels'
  if (['7d', '7 d', '1s', '1 semana'].filter(a => fullArgsJoined.includes(a))[0]) period = '7day'
  if (['1m', '1 m', '30d', '30 d'].filter(a => fullArgsJoined.includes(a))[0]) period = '1month'
  if (['3m', '3 m'].filter(a => fullArgsJoined.includes(a))[0]) period = '3month'
  if (['6m', '6 m'].filter(a => fullArgsJoined.includes(a))[0]) period = '6month'
  if (['1y', '1 y', '12 m', '1 ano'].filter(a => fullArgsJoined.includes(a))[0]) period = '12month'
  
  const url = __lgCore.darkseidLink(d, type, x, y, period, flags !== '' ? flags : undefined)
  return { content: `${user.name}, ${type}, ${x}x${y}, ${period}`, image: url, photo: true }
}

