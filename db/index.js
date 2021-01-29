// 导入 MySQL 模块
const mysql = require('mysql')
// 创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin',
    database: 'my_bigevent_db',
    port:'3306',
})

// 向外共享db数据库连接对象
module.exports = db