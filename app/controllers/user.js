'use strict'

var xss = require('xss')
var mongoose = require('mongoose')
var User = mongoose.model('User')

/**
 * test
 * */
exports.test = async (ctx, next) => {
  ctx.body = {
    success: true,
    tel: ctx.query.tel
  }
  return next
}

/**
 * 注册用户信息
 * */
exports.signup = async (ctx, next) => {
  var phoneNumber = ctx

  console.log('124', ctx)
  var user = await User.findOne({
    phoneNumber: phoneNumber
  }).exec()
  console.log(user)  // null 是db没有
  if (!user) {
    user = new User({
      phoneNumber: xss(phoneNumber)
    })
  } else  {
    user.verifyCode = '112233'
  }

  try {
    user = await user.save()
    ctx.body = {
      success: true
    }
  } catch (e) {
    ctx.body = {
      success: false
    }
    return next
  }
}


/**
 * 更新用户信息操作
 * */
exports.update = async (ctx, next) => {
  var body = ctx.request.body
  var user = ctx.session.user
  ctx.body = {
    success: true,
    text: 'update'
  }
  await next()
}

exports.verify = async (ctx, next) => {
  ctx.body = {
    success: true,
    text: 'verify'
  }
  await next()
}
