/*包含所有工具函数*/

/* 计算跳转URL的函数
  成功授权时: 共有两大种情况:
* 1. 登录: 进入用户主界面
* 2. 注册: 进入信息完善界面
* 每大种情况都有两种可能: 大神界面和老板界面
* 如何判断是否已经完善信息? :后台返回的user信息中是否有avatar信息
* 如何判断用户类型? : user.type*/
export function getRedirectUrl({type,avatar}){
  let path=''
  switch (type){
    case 'dashen' : path='/dashen';break
    case 'laoban': path='/laoban';break
  }
  if(!avatar) path+='info'
  return path
}