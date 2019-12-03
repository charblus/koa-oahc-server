'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema


var BookSchema = new Schema({
  isbn: String,  // 国际规范图书编号
  title: String,
  press: String,  // 出版社
  author: String,
  rate: String,   // 价格
  tags: String,
  image: String,
  status: {type: Boolean, default: true},
  ownerId: String,
  owner: String, 
  ownerImage: String,
  borrowerId : String,
})

module.exports = mongoose.model('Book', BookSchema)