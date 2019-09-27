'use strict'

exports.signup = function *(next) {
  this.body = {
    success: true,
    text: 'signup'
  }
}

exports.verify = function *(next) {
  this.body = {
    success: true,
    text: 'verify'
  }
}

exports.update = function *(next) {
  this.body = {
    success: true,
    text: 'update'
  }
}