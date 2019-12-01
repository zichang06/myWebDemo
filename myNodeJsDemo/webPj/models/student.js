var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/myblog', { useMongoClient: true })

var Schema = mongoose.Schema

var studentSchema = new Schema({
  taskName: {
    type: String,
    required: true
  },
  finish: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
  deadline: {
    type: String,
    required: true
  },
  others: {
    type: String
  }
})

// 直接导出模型构造函数
module.exports = mongoose.model('Student', studentSchema)
