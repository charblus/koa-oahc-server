'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  phoneNumber: {       // 手机号码
    unique: true,     // 唯一
    type: String
  },
  password: String,
  email: String,
  areaCode: String,      // 国际区间号码
  verifyCode: String,    // 验证码 
  verified: {
    type: Boolean,
    default: false,
  },
  accessToken: String,    // 票据 判断用户合法性
  nickname: String,
  gender: String,
  breed: String,
  age: String,
  avatar: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
}) 

// 数据存储之前 （存储也是个中间件）
UserSchema.pre('save', function(next) {
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

/**
 * 定义模型User
 * 模型用来实现我们定义的模式，调用mongoose.model来编译Schema得到Model
 * 
 * */
// 参数User 数据库中的集合名称, 不存在会创建.
module.exports = mongoose.model('User', UserSchema)
/**
 * nodejs中文社区这篇帖子对mongoose的用法总结的不错：https://cnodejs.org/topic/548e54d157fd3ae46b233502
 */