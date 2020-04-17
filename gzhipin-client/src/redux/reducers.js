/*包含多个reducer函数, 根据prev-state和action,产生新state*/
import {combineReducers} from 'redux'

import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RECEIVE_USER_LIST,
  RESET_USER,
  RECEIVE_MSG,
  RECEIVE_MSG_LIST,
  READ_MSG
} from './action-types'
import {getRedirectUrl} from "../utils/tools";

const iniUser = {
  // 注意, 初始化的用户对象是没有指定密码的, 因为后台获取的user不会包含密码
  username:'',
  type:'',
  msg:'',// 用来存放后台返回的错误提示信息
  redirectTo:'', // 指定需要重定向至的路由路径
}
const iniUserList=[]
// 产生user状态的reducer
function  user(state=iniUser,action) {
  switch (action.type){
    case AUTH_SUCCESS: return {...action.data,redirectTo:getRedirectUrl(action.data)}
    case ERROR_MSG: return {...state,msg:action.data}
    case RECEIVE_USER:return action.data
    case RESET_USER:return {...iniUser,msg:action.data}
    default: return state
  }
}
// 产生userlist状态的reducer
function userList(state=iniUserList,action){
switch (action.type){
  case RECEIVE_USER_LIST: return action.data
  default: return state
}
}

// 产生消息列表状态的reducer
const iniChat= {
  users:{},
  chatMsgs:[],
  unReadCount:0 // 总未读数量(底部显示)
}
function chat(state=iniChat,action){
  switch(action.type){
    case RECEIVE_MSG:
      const {chatMsg} = action.data
      return {
      users:state.users,
      chatMsgs:[...state.chatMsgs,action.data.chatMsg],
      unReadCount:state.unReadCount + !chatMsg.read&&chatMsg.to===action.data.userid?1:0
    }
    case RECEIVE_MSG_LIST:
      const {users,chatMsgs,userid}= action.data
      return {
        users,
        chatMsgs,
        unReadCount: chatMsgs.reduce((pre,msg)=>pre+(!msg.read&&msg.to===userid?1:0),0)}
    case READ_MSG:
      const {count,from,to} = action.data
      return {
        users:state.users,
        chatMsgs:state.chatMsgs.map(msg=>{

          if(msg.from ===from&&msg.to===to&&!msg.read){
            return {...msg,read:true}
          }
          else{
            return msg
          }

        }),
        unReadCount:state.unReadCount-count

      }
    default:return state
  }
}
export default combineReducers({
  user,userList,chat
})
/*暴露到各子组件props中的状态结构为: {user:{},userList:[],chat:{}}*/


