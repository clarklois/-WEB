/*包含多个action的产生器, 其中包括同步action和异步action*/
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqMsgList,
  reqReadMsg
} from '../api'
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  READ_MSG
} from './action-types'
import io from 'socket.io-client'

/*定义一个函数, 用来进行初始化socket.io操作(1. 创建socket对象,2. 绑定监听, 接收消息)*/
function iniIO(userid,dispatch){
  /*这里不希望socket对象在每次指定函数时都被创建, 所以保证socket是一个单一实例对象*/
  /*1. 判断, 若未创建, 则创建,2. 创建对象之后, 需要保存对象(在全局中保存); */
  if(!io.socket){// 把socket对象绑定在全局对象io的socket属性上, 实现了单例对象的创建
    io.socket = io('ws://localhost:4000')
  }

  io.socket.on('receiveMsg',function(chatMsg){
    console.log('服务器传来消息:',chatMsg)
    // 只有当chatMsg是与当前用户相关消息时, 才会分发同步action保存消息
    if(chatMsg.from===userid||chatMsg.to === userid){
      dispatch(receiveMsg({chatMsg,userid}))
    }

  })
}
// 只要用户登录, 就需要获取一次用户的消息列表, 一共有三种登录情况,这里定义一个函数
async function getMsgList(userid,dispatch){
  iniIO(userid,dispatch)
  const response = await reqMsgList()
  const result = response.data
  if(result.code===0){
    const {users,chatMsgs} = result.data
    dispatch(receiveMsgList({users,chatMsgs,userid}))
  }
}

//授权成功的同步action
const authSuccess = (user)=>({type:AUTH_SUCCESS, data:user})
// 提示错误信息的同步action
const errorMsg = (msg)=>({type:ERROR_MSG, data:msg})
// 接收用户的同步action
const receiveUser = (user)=>({type:RECEIVE_USER,data:user})
// 重置用户的同步action
export const resetUser = (msg)=>({type:RESET_USER,data:msg})
// 接收用户列表的同步action
const receiveUserList = (userList)=>({type:RECEIVE_USER_LIST,data:userList})
// 接收当前用户消息列表的同步action
const receiveMsgList = ({users,chatMsgs,userid})=>({type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}})
// 接收消息的同步action
const receiveMsg = ({chatMsg,userid})=>({type:RECEIVE_MSG,data:{chatMsg,userid}})
// 读某组消息的同步action
const readMsg = ({count,from,to})=>({type:READ_MSG,data:{count,from,to}})

// 注册异步action
export const register = (user)=>{
  const {username,password,password2,type}=user
  // 前台检查用户名格式
  if(!username){
    return errorMsg('用户名格式错误!')
  }
  // 前台检查密码, 若前后密码不相同, 返回一个同步action
  if(password!==password2){
    return errorMsg('两次输入的密码不相同!')
  }
  // 通过检查, 说明表单数据格式正确, 开始发送异步请求
  return  async dispatch =>{
   // 发送注册请求, 异步ajax
    const response = await reqRegister({username,password,type})
    const result = response.data // response.data就是后台返回的{code:0/1,data:{}/msg:""}对象*/
    if(result.code===0){
      getMsgList(result.data._id,dispatch)
      dispatch(authSuccess(result.data))

    }
    else{
      dispatch(errorMsg(result.msg))
    }
  }
}
// 登录异步action
export const login = (user)=>{
  // 前台检查用户名格式
  if(!user.username){
    return errorMsg('请填写用户名!')
  }
  if(!user.password){
    return errorMsg('密码不能为空')
  }
  return  async dispatch =>{

    const response = await reqLogin(user)
    const result = response.data // response.data就是后台返回的{code:0/1,data:{}/msg:""}对象
    if(result.code===0){
      getMsgList(result.data._id,dispatch)
      dispatch(authSuccess(result.data))
    }
    else if(result.code===1){
      dispatch(errorMsg(result.msg))
    }
  }
}
// 更新用户信息异步action
export const updateUser = (user)=>{
  return async dispatch=>{
    const response = await reqUpdateUser(user)
    const result = response.data
    if(result.code===0){
      dispatch(receiveUser(result.data))
    }
    else{
      dispatch(resetUser(result.msg))
    }
  }
}

// 获取用户信息(通过cookie)异步action
export const getUser = ()=>{
  return async dispatch=>{
    const response = await reqUser()
    const result = response.data
    if(result.code===1){
      dispatch(resetUser(result.msg))
    }
    else{ // 请求用户成功, 下一步:自动登录并跳转
      getMsgList(result.data._id,dispatch)
      dispatch(receiveUser(result.data))
    }
  }
}

// 向后台请求获取userList的异步action
export const getUserList = (type)=>{
  return async dispatch=>{
    const response = await reqUserList(type)
    const result = response.data
    if(result.code===0){
      dispatch(receiveUserList(result.data))
    }
  }
}

// 发送消息的异步action
export const sendMsg = ({from,to,content})=>{
  return () =>{
    console.log('发送请求:',{from,to, content})
    //初始化, 创建socket对象,绑定监听
    /* !!!此处存在问题, iniIO()只有在发送数据时才调用,
     即没有发过消息的用户就没有连接上socket, 也就无法接收服务器端消息*/
    /*iniIO()*/
    // 发送数据
    io.socket.emit('sendMsg',{from,to,content})
  }
}

// 更改消息状态为已读
export const aReadMsg = (from,to)=>{
  return async dispatch=>{
    const response = await reqReadMsg(from)
    const result = response.data
    if(result.code===0){
      const count = result.data
      dispatch(readMsg({count,from,to}))
    }
  }
}