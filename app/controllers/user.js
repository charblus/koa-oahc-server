'use strict'

// var xss = require('xss')
// var mongoose = require('mongoose')
// var User = mongoose.model('User')

exports.test = async (ctx, next) => {
  ctx.body = {
    success: true,
    tel: ctx.query.tel
  }
  return next
}
