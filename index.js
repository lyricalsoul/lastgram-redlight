if (!process.env.LGSTABLE) require('dotenv').config()
require('./lastgram-core')

const express = require('express')
const app = express()
app.use(express.json())

const { execute, generateCtx, parseText, reply: aReply, replyInline: aRI, runInlineQuery } = __lgCore.platform('telegram')

const request = (res, data, method) => {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).json(method ? { method, ...data } : data)
}

const reply = (res, ...args) => request(res, aReply(...args))
const replyInline = (res, ...args) => request(res, aRI(...args), 'answerInlineQuery')

app.all('/tg', async (req, res) => {
  if (req.query?.token !== process.env.TELEGRAM_TOKEN) return res.status(401).send('You thought this would work you hoe?')
  if (process.env.BLACKLIST && process.env.BLACKLIST.split(',').includes(`${req.body?.message?.from?.id}`)) return res.status(200).json({})
  if (req.body.message || req.body.edited_message) {
    const message = req.body.message || req.body.edited_message
    if (message.from.is_bot || !message.text || !message.text.startsWith('/')) return res.status(200).json({})

    const [cmd, args] = parseText(message.text)
    if (cmd.includes('@') && !cmd.includes(process.env.LGSTABLE ? '@lastgramrobot' : '@lastgrameapbot')) return res.status(200).json({})
    const ctx = generateCtx(message, args)
    try {
      const a = await execute(cmd, ctx)
      if (a) return reply(res, ctx, a)
    } catch (e) {
      console.log(e)
      return reply(res, ctx, 'Servidor de farelo, voltamos logo')
    }

    return res.status(200).json({})
  } else if (req.body.inline_query) {
    const q = req.body.inline_query

    try {
      const rst = await runInlineQuery(q)
      return replyInline(res, rst || [], q.id)
    } catch (e) {
      console.log(e)
    }
  }

  return res.json(200).json({})
})

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}!`))
