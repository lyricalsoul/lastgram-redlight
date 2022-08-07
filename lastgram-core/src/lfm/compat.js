module.exports = class Compat {
  constructor (client) {
    this.client = client
  }

  async generate (one, two, noCache = false) {
    const ids = `${one}${two}`.toLowerCase()
    const data = await __lgCore.database.getCompat(ids)

    if (!data || noCache) {
      const [per, artists] = await this.calc(one, two)
      if (!artists) return null
      await __lgCore.database.registerCompat(ids, per, JSON.stringify(artists))
      return [per, artists]
    } else {
      if (((new Date().getTime() - new Date(data.last_update).getTime()) / 1000 / 60 / 60 / 24) >= 1.5) {
        const [per, artists] = await this.calc(one, two)
        if (!artists) return null
        await __lgCore.database.updateCompat(ids, { per, arts: JSON.stringify(artists) })
        return [per, artists]
      }
      return [data.per, JSON.parse(data.arts)]
    }
  }

  async calc (user, secUser) {
    const one = (await this.client.userGetTopArtists(user, { limit: 100 }))?.artist
    const two = (await this.client.userGetTopArtists(secUser, { limit: 100 }))?.artist
    if (!one) return []
    if (!two) return []

    let commonArtists = one.filter(art => {
      return !!two.filter(artT => artT.name === art.name)[0] // try to optimize this loop, it feels dangerous
    }).map((art) => {
      return { ...art, target: two.filter(s => s.name === art.name)[0] }
    }).map((art) => {
      art.sim = calc(parseInt(art.playcount), parseInt(art.target.playcount))*100
      return art
    }).sort((a, b) => b.sim > a.sim)
    if (commonArtists.length === 0) return [0, []]
   
    const comp = (commonArtists.reduce((pa, a) => pa + a.sim, 0) + (commonArtists.length/one.length)) / commonArtists.length + 1
    return [round(comp, 2), commonArtists.slice(0, 5).map(z => z.name)]
  }
}


function calc(n1, n2) {
  if (n1 > n2) return n2/n1
  return n1/n2
}

function round(value, precision = 0) {
  const multiplier = Math.pow(10, precision)
  return Math.round(value * multiplier) / multiplier;
}
