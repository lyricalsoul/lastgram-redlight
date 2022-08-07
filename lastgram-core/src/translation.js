/* eslint-disable no-eval */
const limiters = ['~', '-']
const { format, formatDistance, formatRelative, subDays } = require('date-fns')

const nCache = {}
const codeExtractor = __lgCore.common.extractString(limiters)
const pt = require('date-fns/locale/pt')
const es = require('date-fns/locale/es')
global._e = (text) => text.toString().split('/').join('/\u200B')
                                     .split('@').join('@\u200B')
global._ea = (a) => a.map(_te)

global._t = (lang, space, placeholders = {}) => {
  const [namespace, path] = space.split(':')
  let current = nCache[lang + namespace] || loadAndCache(lang, namespace)
  const steps = path.split('.')

  do {
    current = current[steps.shift()]
  } while (steps.length > 0 && current)

  if (!current && lang === 'en') return null
  if (!current && lang !== 'en') return _t('en', space, placeholders)
  if (current instanceof Array) current = current.join('\n')
  if (current.includes(limiters[0]) && current.includes(limiters[1])) {
    const codes = codeExtractor(current)
    codes.forEach(code => {
      let result = ''
      try { result = eval(code) } catch (e) { console.log(e) }

      current = current.replace(`${limiters[0]}${code}${limiters[1]}`, _e(result))
    })
  }
  
  if (current.includes('<<') && current.includes('>>')) {
    const r = /<<(.*?)>>/gs
    const codes = []
    let found
    while (found = r.exec(current)) {
      codes.push(found[1])
    }
    codes.forEach((code)=> {
      let result = '...'
      try {
        const v = []
        for (let i in placeholders) {
            let statement = `const ${i}=`
            if (['false', 'true', 'undefined', 'null'].includes(`${placeholders[i]}`)) {
              v.push(statement + `${placeholders[i]}` +';')
            } else {
              v.push(statement + `\`${placeholders[i].replace?.('`', '\\`') || placeholders[i]}\`;`)
            }
          }
          result = eval(`${v.join('')} ${code}`)
      } catch (e) { console.log(e) }
      current = current.replace(`<<${code}>>`, result.includes('https://') ? result : _e(result))
    })
  }
  
  for (const i in placeholders) {
    current = current.split(`{{${i}}}`).join(escap(placeholders[i]))
  }
  
  return escapeHTML(current.trim())
}

function loadAndCache (lang, namespace) {
  try {
    nCache[lang + namespace] = require(`${__dirname}/../assets/langs/${lang}/${namespace}.json`)
    return nCache[lang + namespace]
  } catch (e) {
    nCache[lang + namespace] = require(`${__dirname}/../assets/langs/en/${namespace}.json`)
    return nCache[lang + namespace]
  }
}

function escap (a) {
  return (typeof(a) == 'string' ? a : (a?.toString?.() ?? '')).split('*').join('\\*').split('~').join('\\~').split('_').join('\_').split('/').join('/\u200B').split('@').join('@\u200B')
}

function escapeHTML(a) {
  return (typeof(a) == 'string' ? a : (a?.toString?.() ?? '')).split('<').join('\\<').split('>').join('\\>')
}

function get(k) {
  try {
    return eval(k)
  } catch (e) {
    return null
  }
}

String.prototype.escapeAll = function () {
  return escapeHTML(escap(this))
}