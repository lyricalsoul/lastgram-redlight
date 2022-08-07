module.exports = async (ctx, smt, un) => {
   const { count } = await __lgCore.database.supabase.from('users').select('*', { count: 'exact' })
   return _t(ctx.lang, 'geral:botinfo', {
     userCount: count
   })
}
