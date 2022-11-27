const marked = require('marked')

const reply = (ctx, data, others = {}, replying = false) => {
  replying = ctx.wasAChannelReply || data?.quote || replying
  let content = data.content || data
  let z = {}
  if (replying) z.reply_to_message_id = ctx.id
  if (data.photo) {
    others.photo = data.image
    others.caption = content && marked.parseInline(content.toString?.() || content).trim()
    others.method = 'sendPhoto'
  } else {
    content = data.image ? (content.trim() + `[\u200B](${data.image})`) : content
    others.text = marked.parseInline(content).trim().split('<br>').join('\n') || 'dor no cu'
    others.method = 'sendMessage'
  }

  return {
    parse_mode: 'HTML',
    chat_id: ctx.channel,
    ...others,
    ...(replying ? { reply_to_message_id: ctx.id } : {})
  }
}

const replyInline = (results, id) => {
  return {
    inline_query_id: id,
    cache_time: 10,
    is_personal: true,
    results: JSON.stringify(results)
  }
}

const parseText = (text) => {
  if (!text.startsWith('/')) return []
  const [rawCmd, ...args] = text.trim().split(' ')
  const command = (rawCmd.split('/')[1] || '').replace(process.env.LGSTABLE ? '@lastgramrobot' : '@lastgrameapbot', '').toLowerCase()

  return [command, args]
}

const generateCtx = (m, args) => {
  return {
    args,
    platform: 'telegram',
    lang: m.from.language_code?.split?.('-')?.[0],
    channel: m.chat.id,
    mentionedUsers: [],
    id: m.message_id,
    wasAChannelReply: !!m.reply_to_message,
    replyingTo: m.reply_to_message?.from && m.reply_to_message?.from?.id != 777000
      ? {
          content: m.reply_to_message.text,
          user: {
            id: m.reply_to_message.from.id,
            name: m.reply_to_message.from.first_name
          }
        }
      : undefined,
    sender: {
      name: m.from.first_name,
      id: m.from.id,
      isBot: m.from.is_bot
    }
  }
}

const execute = (commandName, ...args) => {
  return __lgCore.getCommand(commandName)?.(...args)
}

const runInlineQuery = async (q) => {
  const rst = await execute('INTERNAL_query',
    q.from.id,
    q.from.first_name,
    q.query.length > 1 ? q.query : null,
    q.from.language_code?.split?.('-')?.[0]
  )

  rst?.map(z => {
    let rendered = false
    if (z.content) {
      z.content = marked.parseInline(z.content).trim()
      if (z.type === 'photo') {
        z.caption = z.content
        z.parse_mode = 'HTML'
      } else {
        z.input_message_content = {
          message_text: z.content,
          parse_mode: 'HTML'
        }
      }
      delete z.content
    }

    return z
  })

  return rst
}

module.exports = { execute, runInlineQuery, generateCtx, parseText, reply, replyInline }
