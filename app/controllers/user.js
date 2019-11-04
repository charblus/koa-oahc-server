'use strict'

var xss = require('xss')
var mongoose = require('mongoose')
var User = mongoose.model('User')
var uuid = require('uuid')

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
  var phoneNumber = xss(ctx.request.body.phoneNumber.trim())
  var user = await User.findOne({
    phoneNumber: phoneNumber
  }).exec()
  console.log(user)  // null 是db没有

  // var verifyCode = ctx.request.body.verifyCode 
  var verifyCode = Math.floor(Math.random()*10000+1)
  // console.log(verifyCode)

  var password = ctx.request.body.password
  // console.log(password)

  if (!user) {
    var accessToken = uuid.v4()

    user = new User({
      nickname: '测试用户',
      avatar: 'https://img.cdn.apipost.cn/statics/portrait.png',
      phoneNumber: xss(phoneNumber),
      verifyCode: verifyCode,
      password: password,
      accessToken: accessToken
    })
  } else {
    ctx.body = {
      success: false,
      msg: '用户已存在'
    }
    return next
  }

  try {
    user = await user.save()
    ctx.body = {
      success: true,
      msg: '注册成功'
    }
  } catch (e) {
    ctx.body = {
      success: false,
      msg: '注册失败'
    }
    return next
  }

}

/**
 * 登录
 * */
exports.login = async (ctx, next) => {
  var phoneNumber = ctx.request.body.phoneNumber
  var password = ctx.request.body.password
  if (!password || !phoneNumber) {
    ctx.body = {
      success: false,
      msg: '手机号码或密码为空'
    }
    return next
  }
  var user = await User.findOne({
    phoneNumber: phoneNumber,
    password: password
  }).exec()
  if (!user) {
    ctx.body = {
      success: false,
      msg: '密码错误',
    }
  } else {
    ctx.body = {
      success: true,
      msg: '登录成功',
      data: {
        nickname: user.nickname,
        accessToken: user.accessToken,
        avatar: user.avatar,
        _id: user._id
      }
    }
  }


}
/**
 * 更新用户信息操作
 * */
exports.update = async (ctx, next) => {
  var body = ctx.request.body
  var user = ctx.session.user
  var fields = 'avatar,gender,age,nickname,breed'.split(',')

  fields.forEach(function(field) {
    if (body[field]) {
      user[field] = xss(body[field].trim())
    }
  })

  user = await user.save()

  ctx.body = {
    code: 1,
    data: {
      accessToken: user.accessToken,
      nickname: user.nickname,
      avatar: user.avatar,
      age: user.age,
      breed: user.breed,
      gender: user.gender,
      _id: user._id
    }
  }
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
 * 手机号码认证
 * */
exports.verify = async (ctx, next) => {
  var verifyCode = ctx.request.body.verifyCode
  var phoneNumber = ctx.request.body.phoneNumber
  if (!verifyCode || !phoneNumber) {
    ctx.body = {
      success: false,
      msg: '手机号码或验证码为空'
    }
    return next
  }

  var user = await User.findOne({
    phoneNumber: phoneNumber,
    verifyCode: verifyCode
  }).exec()

  if(user) {
    user.verified = true
    user = await user.save()
    ctx.body = {
      success: false,
      data: {
        nickname: user.nickname,
        accessToken: user.accessToken,
        avatar: user.avatar,
        _id: user._id
      }
    }
  } else {
    ctx.body = {
      success: false,
      meg: '验证未通过'
    }
  }
}

/**
 * 删除用户
 * */
exports.delUser = async (ctx, next) => {
  const phoneNumber = xss(ctx.request.body.phoneNumber.trim())

	await User.remove({phoneNumber}, (err) => {
		if(err) {
      ctx.body = {
        success: false,
        msg: '删除失败'
      }
		}else{
      ctx.body = {
        success: true,
        msg: '删除成功'
      }
		}
	})

}
/**
 * 查找所有用户
 * */
exports.users = async (ctx, next) => {
  var phoneNumber = ctx.request.body.phoneNumber
  var data = []
  if(!phoneNumber) {
    data = await User.find({}).exec()
  } else {
    data = await User.find({phoneNumber}).exec()
  }
  ctx.body = {
    success: true,
    data: data
  }
}

