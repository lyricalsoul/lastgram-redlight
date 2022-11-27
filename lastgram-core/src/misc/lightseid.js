const fetch = require('node-fetch')
const API_URL = 'https://api-v2.musicorumapp.com'

class Lightseid {
    generateDuotone ({ user, palette, period, entity, story = false }) {
        return this.request('POST', '/collages/generate', {
            user,
            theme: 'duotone',
            language: 'en-US',
            options: {
                period: period.toUpperCase(),
                entity: entity.toUpperCase(),
                palette
            },
            hide_username: true,
            story
        })
    }
    generateCollage ({ user, rows, columns, entity, playCount, names, period, story = false }) {
        return this.request('POST', '/collages/generate', {
            user,
            theme: 'grid',
            language: 'en-US',
            options: {
                rows,
                columns,
                period: period.toUpperCase(),
                entity: entity.toUpperCase(),
                show_names: names,
                show_playcount: playCount,
                style: 'DEFAULT'
            },
            hide_username: true,
            story
        })
    }

    async request (method, endpoint, data) {
        const res = await fetch(`${API_URL}${endpoint}?api_key=${process.env.MUSICORUM_API_KEY}`, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const resp = await res.json()
        if (!res.ok) {console.log(resp); throw new Error(resp.message)}
        return resp
    }
}

module.exports = new Lightseid()