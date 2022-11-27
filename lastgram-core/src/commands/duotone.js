const themes = 'PURPLISH, NATURAL, DIVERGENT, SUN, YELLISH, HORROR, SEA, REWIND2020, PINK, NEON, MUSICORUM'.toLowerCase().split(', ')

module.exports = async (ctx) => {
  const [typeu, user] = __lgCore.common.getUserFromCtx(ctx)

  const d = await __lgCore.database.getLastFm(user.id)
  if (!d) return __lgCore.common.reportNotRegistered(ctx, typeu)

  const fullArgsJoined = ctx.args.join(' ').toLowerCase()
  let type = 'album'
  let period = 'overall'
  if (fullArgsJoined.includes('artist')) type = 'artist'
  if (fullArgsJoined.includes('album')) type = 'album'
  if (fullArgsJoined.includes('track')) type = 'track'

  let palette
  if (themes.filter(a => fullArgsJoined.includes(a))[0]) palette = themes.filter(a => fullArgsJoined.includes(a))[0]
  if (!palette) palette = themes[Math.floor(Math.random() * themes.length)]

  let story = false
  if (['story', 'stories', 'ig', 'instagram'].filter(a => fullArgsJoined.includes(a))[0]) story = true
  
  if (['7d', '7 d', '1s', '1 semana', '1w'].filter(a => fullArgsJoined.includes(a))[0]) period = '7day'
  if (['1m', '1 m', '30d', '30 d'].filter(a => fullArgsJoined.includes(a))[0]) period = '1month'
  if (['3m', '3 m'].filter(a => fullArgsJoined.includes(a))[0]) period = '3month'
  if (['6m', '6 m'].filter(a => fullArgsJoined.includes(a))[0]) period = '6month'
  if (['1y', '1 y', '12 m', '12m', '1 ano'].filter(a => fullArgsJoined.includes(a))[0]) period = '12month'
  
  const img = await __lgCore.musicorum.generateDuotone({ user: d, palette: palette.toUpperCase(), story, period, entity: type })
  return { content: ctx.sender.name + ', duotone, '+ type +', '+ period, image: img.url, photo: true }
}

