'use strict'

var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
  phoneNumber: {       // 手机号码
    unique: true,     // 唯一
    type: String
  },
  areaCode: String,      // 国际区间号码
  verifyCode: String,    // 验证码 
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

// 数据存储以前
UserSchema.pre('save', function(next) {
  if(!this.isNew) {
    this.meta.updateAt = Date.now()
  }
})

module.exports = mongoose.model('User', UserSchema)