/*
测试使用mongoose操作mongodb数据库
* */
const md5 = require('blueimp-md5')
/*1. 连接数据库*/
// 1.1 引入mongoose
const  mongoose = require('mongoose')
// 1.2 建立连接, 此操作会自动在Mongodb中创建一个数据库
mongoose.connect('mongodb://localhost:27017/gzhipin_test')
// 1.3 创建连接对象
const conn = mongoose.connection
// 1.3 监听连接
conn.on('connected',function(){
  console.log('connection succeeded, well done!')
})

/*2.创建Model并进行CRUD操作*/
//2.1 Schema()方法创建Model模板
const userSchema = mongoose.Schema({
  username:{type:String,required:true},
  password:{type:String,required:true},
  type:{type:String,required:true},
  avatar:{type:String},
})
// 2.2 创建Model构造函数
const UserModel= mongoose.model('user',userSchema) // 在创建构造函数时, model()中传的第一个参数应该是文档的名字

// 2.3 生成user对象并保存在集合users中, userModel.save()
//userSave()
function userSave(){
  // 模拟数据库中获得的一个文档
  const user = {
    username:'猪八戒',
    password:md5('113'), // 记得密码要md5加密
    type:"老板"
  };
  const userModel = new UserModel(user);

  userModel.save(function(error,user){
    console.log('添加成功, 返回的错误:',error,'; 添加的用户如下:',user)
  })


}

// 2.4 查询数据库中的数据 Model.find()/findOne()
// userFind()
function userFind(){
// 注意find()/findOne()方法都是构造函数的方法
  UserModel.find({username:'沙悟净'},function(error,data){ // 回调函数处理查询到的数据
    console.log('find()',error,data)
  });
  // find()方法返回的是一个数组, 其中包含所有满足条件的文档对象, 若无匹配文档, 则返回空数组[]
  UserModel.findOne({username:'牛奶'},function(error,data){
    console.log('findOne()',error,data)
  })
  // findOne()方法返回的是数据库中匹配的第一个文档对象, 若无匹配, 则返回null
}

// 2.5 更新数据库中的数据 Model.findByIdAndUpdate()
//userUpdate()
function userUpdate(){
  UserModel.findByIdAndUpdate({_id:'5e68a460048d134798da9e64'},{username:'猪八戒'}
    ,function(error,data){
      console.log('updated:',data,error)
    })
  // findByIdAndUpdate()方法, 是构造函数的方法,
  // 调用步骤: 1.传递搜索条件(只能用_id), 2.传递更新的字段内容, 3. 传递回调函数
  // 方法返回的参数是更新后的文档对象
}
// 2.6 删除数据库中的指定数据 Model.deleteOne()/deleteMany()
userDelete();
function userDelete(){
  UserModel.deleteMany({username:'猪八戒'},function(error,data){
    console.log('removed:',data,error)
  });
}

