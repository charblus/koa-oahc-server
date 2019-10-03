'use strict'

var xss = require('xss')
var mongoose = require('mongoose')
var User = mongoose.model('User')

var SMSClient = require('@alicloud/sms-sdk')
var config = require('../../config/config')

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
  var phoneNumber = ctx.request.body.phoneNumber
  var verifyCode = ctx.request.body.verifyCode 

  // var verifyCode = sms.getCode()

  // console.log('124', ctx)
  var user = await User.findOne({
    phoneNumber: phoneNumber
  }).exec()
  console.log(user)  // null 是db没有
  if (!user) {
    var accessToken = uuid.v4()

    user = new User({
      nickname: '爱因斯坦',
      avatar: 'http://res.cloudinary.com/gougou/image/upload/mooc1.png',
      phoneNumber: xss(phoneNumber),
      verifyCode: verifyCode,
      accessToken: accessToken
    })
  } else {
    user.verifyCode = verifyCode
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

  try {
    // sms.send(user.phoneNumber, verifyCode)
  } catch (e) {
    this.body = {
      success: false,
      err: '短信服务异常'
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

/**
 * 获取验证码
 * */

exports.sendmsg = async (ctx, next) => {
  var phoneNumber = ctx.request.body.phoneNumber
  var number = ''
  for(var i = 0; i < 6; i++) {
    number += Math.floor(Math.random()*10)
  }
  const accessKeyId = config.aliyun.accessKeyId
  const secretAccessKey = config.aliyun.secretAccessKey
  try {
    //初始化sms_client
    let smsClient = new SMSClient({ accessKeyId, secretAccessKey })
    //发送短信
    var s = await smsClient.sendSMS({
      PhoneNumbers: phoneNumber,  //发送的电话号码
      SignName: 'oahc',  //认证签名
      TemplateCode: 'SMS_174988445',   //模板id
      TemplateParam: '{"code": "' + number + '"}'   // 模板所需参数 为json字符串
    })
    console.log(`${phoneNumber}用户，${config.aliyun.errorMap[s.Code]}--验证码${number}`)
    if (s.Code == 'OK') {
      ctx.body = {
        code: 1,
        msg: '获取成功'
      }
    } else {
      ctx.body = {
        code: 0,
      }
    }
  } catch (e) {
    ctx.body = {
      success: false,
      err: '短信服务异常'
    }
    return next
  }
}
/**
 * 验证
 * */
exports.verify = async (ctx, next) => {
 
}
