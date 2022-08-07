module.exports = async (userid, authorname, usernamea, lang) => {
  let username = usernamea
  let displayName = username
  if (!username) {
    const d = await __lgCore.database.getLastFm(userid)
    if (!d) return []
    username = d
    displayName = authorname
  }
  const a = await __lgCore.lfm.miscGetNP(username)
  if (!a) return []

  const content = _t(lang, 'fm:ln', {
    name: displayName,
    ...a
  })
  const photo = (a?.cover && a.cover.replace('300x300', '500x500')) || ''

  return genResults(userid, authorname, username, lang, content, a, photo, displayName)
}

function genResults (userid, authorname, username, lang, content, r, photo, name) {
  const results = []
  
  results.push({
    type: 'article',
    id: userid + name.split('')[0] + 'a',
    thumb_url: photo,
    title: `${_t(lang, 'addon:query.ln', { name })}`,
    content: `${content}[\u200B](${photo})`,
    description: `${r.artist} - ${r.track}`
  })

  photo && results.push({
    type: 'photo',
    id: userid + name.split('')[0] + 'p',
    photo_url: photo,
    thumb_url: photo.replace('500x500', '300x300'),
    title: `${_t(lang, 'addon:query.ln', { name })} (${_t(lang, 'addon:qtypes.asPhoto')})`,
    content,
    description: `${r.artist} - ${r.track}`
  })

  results.push({
    type: 'article',
    id: userid + name.split('')[0] + 'n',
    thumb_url: photo,
    title: `${_t(lang, 'addon:query.ln', { name })} (${_t(lang, 'addon:qtypes.noImages')})`,
    content,
    description: `${r.artist} - ${r.track}`
  })
  
  results.push({
    type: 'photo',
    id: userid + name.split('')[0] + 'ar',
    photo_url: __lgCore.darkseidLink(username, 'artist'),
    thumb_url: __lgCore.darkseidLink(username, 'artist'),
    title: _t(lang, 'addon:query.cartist', { name }),
    content: _t(lang, 'addon:query.cartist', { name }),
    description: `3x3, overall, artist`
  })
  
  results.push({
    type: 'photo',
    id: userid + name.split('')[0] + 'al',
    photo_url: __lgCore.darkseidLink(username, 'album'),
    thumb_url: __lgCore.darkseidLink(username, 'album'),
    title: _t(lang, 'addon:query.calbum', { name }),
    content: _t(lang, 'addon:query.calbum', { name }),
    description: `3x3, overall, album`
  })
  
  results.push({
    type: 'photo',
    id: userid + name.split('')[0] + 'tr',
    photo_url: __lgCore.darkseidLink(username, 'track'),
    thumb_url: __lgCore.darkseidLink(username, 'track'),
    title: _t(lang, 'addon:query.ctrack', { name }),
    content: _t(lang, 'addon:query.ctrack', { name }),
    description: `3x3, overall, artist`
  })
  
  return results
}
