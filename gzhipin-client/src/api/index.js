/*包含多个接口请求的函数
*  函数的返回值: promise对象
* */
import ajax from './ajax'
// 注册接口
export const reqRegister=(user)=>ajax('/register',user,'POST')

// 登录接口
export const reqLogin=({username,password})=>ajax('/login',{username,password},'POST')

// 更新用户接口
export const reqUpdateUser=(user)=>ajax('/update',user,'POST')

// 获取用户信息(通过cookie)接口
export const reqUser=()=>ajax('/user') //type值默认为GET,不用写

// 获取用户列表(通过用户类型)
export const reqUserList=(type)=>ajax('/userlist',{type}) //type值默认为GET,不用写

// 获取当前用户的信息列表
export const reqMsgList =()=>ajax('/msglist')

// 更改消息是否已读状态
export const reqReadMsg = (from)=>ajax('/readmsg',{from},'POST')