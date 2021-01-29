// 为了保证 路由模块 的纯粹性，
// 所有的  路由处理函数 ，必须抽离到对应的  路由处理函数模块 中
// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 这个包
const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')

// 4.1注册新用户的处理函数
//      1. 检测表单数据是否合法
//      2. 检测用户名是否被占用
//      3. 对密码进行加密处理
//      4. 插入新用户
exports.regUser = (req,res) => {
    // res.send('reguser ok')
    // 判断用户名和密码是否为空
    const userinfo = req.body
    if (!userinfo.username || !userinfo.password) {
        return res.send({
            status: 1,
            message:'用户名或者密码不能为空'
        })
    }
    // 检测用户名是否被占用
    const sql = "select * from ev_users where username=?"
    db.query(sql, userinfo.username, (err, result) => {
        // 执行sql语句失败
      if (err) {
        //   return res.send({
        //       status: 1,
        //       message:err.message
        //   })
          return res.cc(err)
        }
        // 用户名被占用
        if (result.length>0) {
            // return res.send({
            //     status: 1,
            //     message:"用户名被占用，请更换用户名"
            // })
            return res.cc("用户名被占用，请更换用户名")
        }
        // TODO:用户名可用，继续后续流程
        // 对密码进行加密处理
        // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        const sql = 'insert into ev_users set ?'
        db.query(sql, { username: userinfo.username, password: userinfo.password }, function
            (err, results) {
             // 执行 SQL 语句失败
            //  if (err) return res.send({ status: 1, message: err.message })
             if (err) return res.cc(err)
            // SQL 语句执行成功，但影响行数不为 1
            //  if (results.affectedRows !== 1) {
            //   return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
            // }
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
             // 注册成功
            //  res.send({ status: 0, message: '注册成功！' })
            res.cc('注册成功！', 0)
            })
   
    })



}

// 4.2用户登录的处理函数
// 1. 检测表单数据是否合法
// 2. 根据用户名查询用户的数据
// 3. 判断用户输入的密码是否正确
// 4. 生成 JWT 的 Token 字符串
exports.login = (req,res) => {
    // res.send('login ok')
    const userinfo = req.body
    const sql = `select * from ev_users where username=?`
    db.query(sql, userinfo.username, function (err, results) {
         // 执行 SQL 语句失败
         if (err) return res.cc(err)
         // 执行 SQL 语句成功，但是查询到数据条数不等于 1
         if (results.length !== 1) return res.cc('登录失败！')
         // TODO：判断用户输入的登录密码是否和数据库中的密码一致
        // 拿着用户输入的密码,和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        // 如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResult) {
            return res.cc('登录失败！')
        }
        // TODO：登录成功，生成 Token 字符串
        const user = { ...results[0], password: '', user_pic: '' }
        // 导入配置文件
        const config = require('../config')
        // 生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: '10h', // token 有效期为 10 个小时
        })
        res.send({
             status: 0,
             message: '登录成功！',
             // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
             token: 'Bearer ' + tokenStr,
        })
    })
}