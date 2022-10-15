const aliasDict = {
  listening: 'ln',
  pl: 'ln',
  ltn: 'ln',
  lt: 'ln',
  lnn: 'ln',
  lnf: 'lnfull',
  lp: 'ln',
  me: 'eu',
  mealb: 'eualb',
  meart: 'euart',
  col: 'cllg',
  colagem: 'cllg'
}

const runCommand = (cmd, lastAttempt) => async (...args) => {
  try {
    let b = await cmd(...args)
    if (!b) b = '👿'

    if (args[0]?.platform === 'discord') {
      if (b.content) b.content = b.content.split('@').join('@\u200B')
      else b = b.split('@').join('@\u200B')
    }
    
    if ((b == _t(args[0]?.lang, 'errors:fm')) && !lastAttempt) return runCommand(cmd, true)(...args)
    else return b
  } catch (e) {
    if (e.message.includes('Cannot find module')) return null

    __lgCore.notifier().reportError(e.stack, args[0]?.platform ? `${args[0]?.platform};${args[0]?.channel};${args[0]?.sender.name}` : 'addon')
    return _t(args[0]?.lang || 'pt', 'errors:exec')
  }
}

const getCommand = (name) => {
  try {
    const f = require(`./commands/${name}.js`)
    return runCommand(f)
  } catch (e) {
    const nd = aliasDict[name]
    if (!nd) return null
    else return getCommand(nd)
  }
}

global.__lgCore = {
  aliasDict,
  database: require('./database/.'),
  lfm: require('./lfm/.'),
  common: require('./misc/common'),
  notifier: () => require('./misc/notifier'),
  getCommand,
  platform: (name) => require(`./platforms/${name}`),
  darkseidLink: (d, type = 'artist', x = 3, y = 3, period = 'overall', flags = undefined) => `${process.env.DARKSEID_URL || 'lastgram-blueslimee.vercel.app/api/renderc/?a=lgrocks'}&i=collage&u=${d.toLowerCase()}&d=${x}x${y}&p=${period}&t=${type}&ts=${Date.now()}` + (flags ? '&f='+ flags : '')
}
