module.exports = {
  getUserFromCtx: (ctx, mode = 0) => {
    if (mode == 1) return ['sender', ctx.sender] // 1: sender

    if (ctx.replyingTo?.user?.id) return ['reply', ctx.replyingTo.user]
    if (ctx.mentionedUsers[0]?.id) return ['mention', ctx.mentionedUsers[0]]
    return mode !== 2 ? ['sender', ctx.sender] : []
  },
  reportNotRegistered: (ctx, type) => {
    if (type === 'sender') return _t(ctx.lang, 'errors:nr.sender')
    else return _t(ctx.lang, 'errors:nr.other')
  },
  reportNoneMentioned: (ctx) => {
    return _t(ctx.lang, 'errors:nomention')
  },
  extractString: ([beg, end]) => {
    const matcher = new RegExp(`${beg}(.*?)${end}`, 'gm')
    const normalise = (str) => str.slice(beg.length, end.length * -1)
    return (str) => {
      return str.match(matcher).map(normalise)
    }
  }
}
