const sleep = (ms) => new Promise(r => setTimeout(r, ms))
module.exports = async (ctx) => {
  const [typeu, user] = __lgCore.common.getUserFromCtx(ctx)

  const d = await __lgCore.database.getLastFm(user.id)
  if (!d) return __lgCore.common.reportNotRegistered(ctx, typeu)

  const fullArgs = ctx.args
  const fullArgsJoined = ctx.args.join(' ').toLowerCase()
  const [x, y] = fullArgs.filter(a => a.includes('x'))[0]?.toLowerCase?.()?.split?.('x').map(a => parseInt(a)) ?? [3, 3]
  if (x > 20 || y > 20) return _t(ctx.lang, 'fm:cllg.huge')
  let type = 'album'
  let period = 'overall'
  let flags = ''
  if (fullArgsJoined.includes('artist')) type = 'artist'
  if (fullArgsJoined.includes('album')) type = 'album'
  if (fullArgsJoined.includes('track')) type = 'track'
  if (fullArgsJoined.includes('notext') || fullArgsJoined.includes('nolabel')) flags += 'nolabels,'
  if (['story', 'stories', 'ig', 'instagram'].filter(a => fullArgsJoined.includes(a))[0]) flags += 'stories,'
  if (['7d', '7 d', '1s', '1 semana', '1w'].filter(a => fullArgsJoined.includes(a))[0]) period = '7day'
  if (['1m', '1 m', '30d', '30 d'].filter(a => fullArgsJoined.includes(a))[0]) period = '1month'
  if (['3m', '3 m'].filter(a => fullArgsJoined.includes(a))[0]) period = '3month'
  if (['6m', '6 m'].filter(a => fullArgsJoined.includes(a))[0]) period = '6month'
  if (['1y', '1 y', '12 m', '12m', '1 ano'].filter(a => fullArgsJoined.includes(a))[0]) period = '12month'
  
  const url = await __lgCore.darkseidLink(d, type, x, y, period, flags !== '' ? flags : undefined)
  return { content: `${user.name}, ${type}, ${x}x${y}, ${period} ${flags !== '' ? '('+ flags.trim() +')' : ''}`, image: url, photo: true }
}

