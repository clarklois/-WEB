/*包含多个操作数据库集合数据的Model模块*/
/*连接数据库*/
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/guiguzhipin')
const conn = mongoose.connection // 注意connection不是方法, 不调用
conn.on('connected',()=>{
  console.log('connect succeed!')
})

/* 创建Model构造函数*/
const userSchema = mongoose.Schema({
  username:{type:String, required:true},
  password:{type:String, required:true},
  type:{type:String, required:true},
  avatar:{type:String},
  post:{type:String},// 职位
  info:{type:String}, //个人或职位简介
  company:{type:String},
  salary:{type:String}
})
const UserModel = mongoose.model('user',userSchema)

// 创建聊天schema
const chatSchema = mongoose.Schema({
  from:{type:String,required:true},
  to:{type:String,required:true},
  chat_id:{type:String,required:true}, // 聊天(室)id
  content:{type:String,required:true},
  read:{type:Boolean,default:false}, //是否已读
  create_time:{type:Number} // 创建时间, 用于对消息排序
})
const ChatModel = mongoose.model('chat',chatSchema)



// 暴露Model
/*
* 暴露的方法: 2种
* 1. 一次性暴露, module.exports = xxx
* 2. 分别暴露: export.xxx = val,
*              export.yyy = val
* */
exports.UserModel = UserModel // 暴露UserModel,起名字为UserModel
exports.ChatModel = ChatModel
