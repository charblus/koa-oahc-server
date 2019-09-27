'use strict'

// 加载数据模型文件 start
var fs = require('fs')
var path = require('path')
var mongoose = require('mongoose')
var db = 'mongodb://localhost/oahc-web'

mongoose.Promise = require('bluebird')
mongoose.set('useCreateIndex', true) 
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
  if(err){  
　  console.log('Connection Error:' + err)  
　}else{   
　  console.log('Connection success!')
  }  
})

var models_path = path.join(__dirname, '/app/models')    // __dirname当前目录层级

var walk = function(modelPath) {
  // fs的readdirSync 同步读取modelPath下文件 并对其遍历
  fs
    .readdirSync(modelPath)  
    .forEach(function(file) {
      var filePath = path.join(modelPath, '/' + file)   // 拼接完整路径
      var stat = fs.statSync(filePath)           // 当前文件的状态

      if(stat.isFile() ){
        // 是否是文件
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(filePath)
        }
      } else if (stat.isDirectory()){
        // 是否是目录 
        walk(filePath)
      }
    })
}

walk(models_path)
// 加载数据模型文件 end

var koa = require('koa')
var logger = require('koa-logger')
var session = require('koa-session')
var bodyParser = require('koa-bodyparser')
var app = new koa()

app.keys = ['oahc']
app.use(logger())
app.use(session(app))
app.use(bodyParser())

var router = require('./config/routes')()

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(1104)
console.log('listening: 1104')
