var fs = require('fs')
var Student = require('./student')
var express = require('express')
var router = express.Router()

// Student.updateById({
//     id:1,
//     name: '张小三'
// }, function(err) {
//     if(err) {
//         return console.log('修改失败')
//     }
//     console.log('修改成功')
// })

router.get('/students', function(req, res) {  
    Student.find(function(err, students) {  //该回调函数作为student.find的参数callback
        if(err) {
            return res.status(500).send('Server Error')
        }
        res.render('index.html', {
            fruits:[
                '苹果',
                '香蕉',
                '橘子'
            ],
            students: students  
            // 前者students是渲染模板中的
            // 后者students是形参，传给find函数中callback的实参
        })
    })
})

router.get('/students/new', function(req, res) {
    res.render('new.html')
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
            student: student
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