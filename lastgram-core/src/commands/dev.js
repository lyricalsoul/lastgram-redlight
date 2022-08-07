module.exports = async (ctx) => {
  if (ctx.sender.id != '673677252462116874' && ctx.sender.id != 1889562226 && ctx.sender.id != -1889562226) return undefined
  switch (ctx.args[0]) {
    case 'mtg':
      await __lgCore.database.createUser(parseInt(ctx.args[1]), ctx.args[2])
      return 'ok'

    case 'evl':
      let r = '...'
      try {
        ctx.args.shift()
        const a = Date.now()
        let z = eval(ctx.args.join(' '))
        const b = Date.now()
        let prom = false
        if (z instanceof Promise) {
          z = await z
          prom = true
        }

        r = `🕜 ${b - a}ms${prom ? ' (was a promise)' : ''}\n\`\`\`js\n${require('util').inspect(z, true, 3, false).trim().substring(0, 1930)}\n\`\`\``
      } catch (e) {
        r = `\`\`\`js\n${e.stack}\n\`\`\``
      }
      return r

    case 'ididb':
      const v = require(ctx.args[1]).values
      await Promise.all(v.map(z => __lgCore.database.createUser(z[0], z[1])))

      return `${v.length} inseridos`
      
    default:
      return 'mtg/evl/ididb/lgr...'
  }
}
