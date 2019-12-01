var express = require('express')
var User = require('./models/user')
var Student = require('./models/student')
var md5 = require('blueimp-md5')

var router = express.Router('path')

router.get('/', function (req, res) {
    // console.log(req.session.user)
    res.render('index.html', {
      user: req.session.user
    })
  })

router.get('/login', function(req, res) {
    res.render('login.html')
})

router.post('/login', function(req, res) {
    var body = req.body

    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, function(err, user) {
        if(err) {
            return res.status(500).json({
                err_code: 500,
                message: err.message
            })
        }

        if(!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid.'
            })
        }

        req.session.user = user
        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})

router.get('/register', function(req, res) {
    res.render('register.html')
})

router.post('/register', function(req, res) {
    var body = req.body
    User.findOne({
        $or: [
            {
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, function(err, data) {
        if(err) {
            return res.status(500).json({  
                // ???我的json反馈在客户端console一直不能显示
                // register.html中的ajax居然正常使用。。。?
                // 同步表单提交后浏览器也没有把返回直接显示在页面上（day6-11-09:00）
                err_code: 500,
                message: 'Internal error'
            })
        }
        if(data)  {// 查到符号条件的用户对象，即邮箱或者昵称已存在
            console.log("email or nickname already exists")
            return res.status(200).send({
                err_code: 1,
                message: 'Email or nickname already exists'
            })
        }

        body.password = md5(md5(body.password))
        new User(body).save(function(err, user) {
            if(err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'Internal error'
                })
            }

            req.session.user = user

            res.status(200).json({
                err_code: 0,
                foo: 'OK'
            })
        })
        //console.log(body)
    })
})


router.get('/logout', function(req, res) {
    req.session.user = null
    res.redirect('/login')
})


router.get('/students', function(req, res) {  
    Student.find(function(err, students) {  //该回调函数作为student.find的参数callback
        if(err) {
            return res.status(500).send('Server Error')
        }
        res.render('index_stu.html', {
            students: students,
            user: req.session.user 
            // 前者students是渲染模板中的
            // 后者students是形参，传给find函数中callback的实参
        })
    })
})

router.get('/students/new', function(req, res) {
    res.render('new.html', {
        user: req.session.user 
    })
})

router.post('/students/new', function(req, res) {
    new Student(req.body).save(function(err) {
        if(err) {
            return res.status(500).send('Server Error')
        }
        res.redirect('/students')
    })
})

router.get('/students/edit', function(req, res) {
    Student.findById(req.query.id, function(err, student){
        if(err) {
            return res.status(500).send('Server Error')
        }
        res.render('edit.html', {
            student: student,
            user: req.session.user 
        })

    })
    
})


router.post('/students/edit', function(req, res) {
    Student.findByIdAndUpdate(req.body.id, req.body, function(err) {
        // console.log(req.query.id)  原来不知道为啥把req.body.id写成req.query.id，debug一上午→.→
        // console.log(req.body.id)
        // !!!get请求用query解析url问号后面的数据
        // post使用body解析表单内容（body-parser）
        if(err) {
            return res.status(500).send('Server Error')
        }
        res.redirect('/students')
    })
})

router.get('/students/delete', function(req, res) {
    Student.findByIdAndRemove(req.query.id, function(err) {
        console.log(req.query.id)
        if(err) {
            return res.status(500).send('Server Error')
        }
        res.redirect('/students')
    })
})


module.exports = router