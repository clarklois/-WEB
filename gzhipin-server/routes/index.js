const express = require('express');
const router = express.Router();
const md5 = require('blueimp-md5')


// 引入定义好的Model
const {UserModel,ChatModel} = require('../db/models')

const filter = {password:0,__v:0} // 指定要过滤掉的属性,固定语法
/*注册路由,get方式*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 注册一个用于用户注册的路由
/*需求:
  1. path为: /register
  2. 请求方式为:POST
  3. 接收username和password参数
  4. admin为已注册用户
  5. 注册成功返回: {code:0,data:{id:'abc',username:'xxx',password:'123'}}
  6. 注册失败返回: {code:1, msg:'用户名已存在'}
* */
/*router.post('/register',(req,res)=>{
  // 请求参数
  const {username,password}=req.body
  // 处理数据
  if(username==='admin'){
    // 返回失败信息
    res.send({code:1,msg:'该用户名已存在'})
  }
  else{
     // 成功响应
    res.send({code:0,data:{id:'abc',username:'123',password:'123'}})
  }
})*/

/*注册的路由*/
router.post('/register',(req,res)=>{
  // 获取请求的参数
  const {username,password,type} = req.body
  // 向数据查询username是否存在
  UserModel.findOne({username}, (error,user)=>{
    if(user){
      res.send({code:1,msg:'该用户名已被占用'})
    }// 判断, 数据库中是否存在此用户名
    else{
      const userModel = new UserModel({username,type,password:md5(password)})
      userModel.save(function(error,user){
        res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})
        res.send({code:0,data:{username,type,_id:user._id}})
      })
    }
  })
})
/*登录的路由*/
router.post('/login',(req,res)=>{
  const {username,password} = req.body
  // 根据username和password,查询用户名是否存在
  UserModel.findOne({username,password:md5(password)},filter,function(err,user){
    if(user){ // 成功
      // 生成cookie,交给浏览器
      res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})
      // 返回
      res.send({code:0,data:user})

    }
    else{
      res.send({code:1,msg:'用户名不存在或密码错误'})
    }
  })
})
/*更新用户信息的路由*/
router.post('/update',(req,res)=>{
  // 从cookie中获取user_id
  const userid = req.cookies.userid
  if(!userid){
    return res.send({code:1,msg:'请先登录!'})
  }
  // 若userid存在, 则根据id以及提交的用户数据,更新相应
  const user =req.body
  UserModel.findByIdAndUpdate({_id:userid},user,function(error,doc){
    /* findByIdAndUpdate在回调中会返回尚未被修改的user信息*/
    if(!doc){ // 若doc不存在, 说明cookie中的信息有误, 通知浏览器删除此cookie
      res.clearCookie(userid)
      // 返回提示信息
      res.send({code:1,msg:'请先登录!'})
    }
    else{
      // doc存在, 则说明更新成功
      const {_id,username,type}=doc
      const data = Object.assign(user,{_id,username,type})
       /*const data = Object.assign(doc,user)*/
      /*const data = UserModel.findById(userid)*/
      res.send({code:0,data})// 前端axios的response.data 就是这里的{code:0,data:data}/{code:1,msg:'xxx"}
    }
  })
})
/*获取用户信息(根据cookie)的路由*/
router.get('/user',(req,res)=>{
  const userid = req.cookies.userid
  if(!userid){return res.send({code:1,msg:'请先登录!'})}
  // 根据userid查询
  UserModel.findOne({_id:userid},filter,function (error,user) {
    if(!user){
     return res.send({code:1,msg:'用户不存在'})
    }
    else{
      res.send({code:0,data:user})
    }
  })
})
/*获取用户列表(根据当前用户类型)*/
router.get('/userlist',(req,res)=>{
  const {type} = req.query //获取请求中的数据, get类型的请求,数据在req的query或者param中
  UserModel.find({type},function(err,users){
    res.send({code:0,data:users})
  })

})

/*获取当前用户的聊天信息列表*/
router.get('/msglist',(req,res)=>{
  const userid = req.cookies.userid
  UserModel.find(function(err,userdocs){
    /* 查找所有user, 将其中的username和avatar封装成对象传入users对象中(各user的属性名为其_id)
    const users = {}
    userdocs.forEach(user=>{
      users[user._id]={username:user.username,avatar:user.avatar}
    })*/
    /*用数组的forEach可以实现, 实际上用reduce也可以*/
    const users= userdocs.reduce((users,user)=>{
      users[user._id]={username:user.username,avatar:user.avatar}
      return users // reduce的回调一定要return值
    },{})

    /*
    * 参数1: {'$or(或者)':[{条件1},{条件2}]}
    * 参数2: 过滤 filter
    * 参数3: 回调*/
    ChatModel.find({'$or':[{from:userid},{to:userid}]},filter,function(err,chatMsgs){
      res.send({code:0,data:{users,chatMsgs}})
    })
  })
})

/*修改指定消息为已读*/
router.post('/readmsg',(req,res)=>{
  const {from} = req.body
  const to = req.cookies.userid /*to应该是发送'已读消息'请求的当前用户, 而from(发消息的人)应该是看到消息已读的一方*/
  /*
  * 参数1: 查询条件
  * 参数2: 更新为指定的数据对象
  * 参数3: 是否1次更新多条, 默认只更新一条
  * 参数4: 更新完成的回调函数
  * */
  ChatModel.update({from,to,read:false},{read:true},{multi:true},function(err,doc){
    console.log('/readmsg',doc)
    res.send({code:0,data:doc.nModified}) /* nModified为更新的数量*/
  })
})

module.exports = router;
