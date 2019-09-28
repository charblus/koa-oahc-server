'use strict'

exports.signature = async (ctx, next) => {
  ctx.body = {
    success: true
  }
  await next()
}
