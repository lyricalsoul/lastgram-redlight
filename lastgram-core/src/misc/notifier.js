const { Webhook, MessageBuilder } = require('discord-webhook-node')

const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL)
hook.setUsername('Demi Lovato Pré-Abdução Alien')
hook.setAvatar('https://media.discordapp.net/attachments/826549853932224543/863556216085413898/CRTX93SWIAEHlo5.jpg')

module.exports = {
  reportError: (stack, data) => {
    console.log(stack)
    const embed = new MessageBuilder()
      .setTitle('Love + Fear só que só o Fear (Erro)')
      .addField('Culpado', data)
      .addField('@lastgram/core', `${__lgVersion.join('-')} (${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB)`)
      .setColor('#ff0000')
      .setImage('https://media.discordapp.net/attachments/826549853932224543/863660160249102336/20210710_170951.jpg')
      .setDescription(`\`\`\`js\n${stack}\`\`\``.substring(0,1989))
      .setTimestamp()

    hook.send(embed)
  }
}
