// router 文件夹，用来存放所有的 路由 模块
// 新建  user.js 文件，作为用户的路由模块
// 1 导入express
const express = require('express')
const { regUser, login } = require('../router_handler/user')
// 2 创建路由对象
const router = express.Router()
// 为了保证 路由模块 的纯粹性，
// 所有的  路由处理函数 ，必须抽离到对应的  路由处理函数模块 中
// 3 导入用户路由处理函数模块
const userHandler = require('../router_handler/user')
// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')


// 4 创建用户路由模块
// 4.1注册新用户
router.post('/reguser', userHandler.regUser)
// 4.2用户登录
router.post('/login', userHandler.login)




// 5 将对象共享出去
module.exports = router