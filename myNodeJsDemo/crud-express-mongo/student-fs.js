var fs = require('fs')

var dbPath = './db.json'

exports.find = function(callback) {
    // callback中得参数，第一个是err,第二个参数是结果
    fs.readFile(dbPath, 'utf8', function(err, data) {
        if(err) {
            return callback(err)
        }
        callback(null, JSON.parse(data).students)
    })
}

exports.findById = function(id, callback) {
    fs.readFile(dbPath, 'utf8', function(err, data) {
        if(err) {
            return callback(err)
        }
        var students = JSON.parse(data).students
        var ret = students.find(function(item) {
            return item.id === id
        })
        callback(null, ret)
    })
}

exports.save = function(student, callback) {
    fs.readFile(dbPath, 'utf8', function(err, data) {
        if(err) {
            return callback(err)
        }
        var students = JSON.parse(data).students
        student.id = students[students.length - 1].id + 1
        students.push(student)
        var fileData = JSON.stringify({
            students:students
        })
        fs.writeFile(dbPath, fileData, function(err){
            if(err) {
                return callback(err)
            }
            callback(null)
        })
    })
}

exports.updateById = function(student, callback) {
    fs.readFile(dbPath, 'utf8', function(err, data) {
        if(err) {
            return callback(err)
        }
        var students = JSON.parse(data).students
        student.id = parseInt(student.id)
        var stu = students.find(function(item) {
            return item.id === student.id
        })
        for (var key in student) {
            stu[key] = student[key]
        }

        var fileData = JSON.stringify({
            students:students
        })
        fs.writeFile(dbPath, fileData, function(err){
            if(err) {
                return callback(err)
            }
            callback(null)
        })
    })
}

exports.deleteById = function(id, callback) {
    fs.readFile(dbPath, 'utf8', function(err, data) {
        if(err) {
            return callback(err)
        }
        var students = JSON.parse(data).students

        var deleteIndex = students.findIndex(function(item) {
            return item.id === parseInt(id)
        })

        students.splice(deleteIndex, 1)

        var fileData = JSON.stringify({
            students:students
        })
        fs.writeFile(dbPath, fileData, function(err){
            if(err) {
                return callback(err)
            }
            callback(null)
        })
    })

}