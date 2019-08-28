var express = require('express')
var User = require('./models/user')
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
module.exports = router