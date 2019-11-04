 'use strict'

var Router = require('koa-router')
var User = require('../app/controllers/user')
var App = require('../app/controllers/app')

module.exports = function() {
  var router = new Router({
    prefix: '/api'     // 前缀
  })
  

  router.get('/', async (ctx, next) => {
    ctx.response.body = '<h1>oahc oay</h1>';
  });

  // user
  router.get('/test',  User.test)
  router.post('/u/signup', App.hasBody, User.signup)
  router.post('/u/sendmsg', User.sendmsg)
  router.post('/u/verify', User.verify)
  router.post('/u/update', App.hasBody, App.hasToken, User.update)

  // app
  router.post('/signature', App.signature)   // 加密的签名

  return router
}
