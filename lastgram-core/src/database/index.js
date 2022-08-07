const { PostgrestClient } = require('@supabase/postgrest-js')

const supabase = new PostgrestClient(`${process.env.SUPABASE_URL}/rest/v1`, {
  headers: {
    apikey: process.env.SUPABASE_KEY
  }
})

const wrap = async (b) => {
  const c = await b
  if (process.env.DEBUGGING) console.log(c)
  if (!c?.data || c?.error) return null
  else return c.data
}
module.exports = {
  supabase,
  createUser: (id, username) => {
    return wrap(supabase
      .from('users')
      .insert({ pid: id, layout: 'default', lfm_username: username }, { onConflict: 'id' }))
  },
  getLastFm: (id) => {
    return wrap(supabase
      .from('users')
      .select('lfm_username')
      .eq('pid', id)
      .single()).then(v => v?.lfm_username)
  },
  updateUser: (id, data) => {
    return wrap(supabase
      .from('users')
      .update(data)
      .match({ pid: id }))
  },
  registerCompat: (ids, per, artists) => {
    return wrap(supabase
      .from('users_compat')
      .insert({ ids, per, arts: artists })
    )
  },
  getCompat: (ids) => {
    return wrap(supabase
      .from('users_compat')
      .select('per, arts, last_update')
      .eq('ids', ids).single()
    )
  },
  updateCompat: (ids, data) => {
    return wrap(supabase
      .from('users_compat')
      .update(data)
      .match({ ids }))
  },
  getAuthKey: (id) => {
    return wrap(supabase
      .from('users_auth')
      .select('key')
      .eq('pid', id)
      .single()).then(v => v?.key)
  },
  setAuthKey: (id, key) => {
    return wrap(supabase
      .from('users_auth')
      .insert({ pid: id, key }, { onConflict: 'id' }))
  }
}
