/*主界面路由*/
import React,{Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie' // 可以操作前端cookie的对象 set() get() remove()
import {NavBar} from "antd-mobile";

import LaobanInfo from '../laoban-info/laoban-info'
import DashenInfo from '../dashen-info/dashen-info'
import Dashen from '../dashen/dashen'
import Laoban from '../laoban/laoban'
import Personal from '../personal/personal'
import Message from '../message/message'
import NotFound from "../../components/not-found/not-found";
import Chat from '../chat/chat'

import {getRedirectUrl} from '../../utils/tools'
import {getUser} from "../../redux/actions";
import NavFooter from "../../components/nav-footer/nav-footer";
import nav from "eslint-plugin-jsx-a11y/src/util/implicitRoles/nav";
class Main extends Component{

  navList = [
    {
      path:'/laoban',
      component:Laoban,
      title:'大神列表',
      icon:'dashen',
      text:'大神'
    },
    {
      path:'/dashen',
      component:Dashen,
      title:'老板列表',
      icon:'laoban',
      text:'老板'
    },{
      path:'/message',
      component:Message,
      title:'消息列表',
      icon:'message',
      text:'消息'
    },
    {
      path:'/personal',
      component:Personal,
      title:'个人中心',
      icon:'personal',
      text:'个人'
    }
  ]

  componentDidMount(){
    //  如果cookie中有userid(说明用户登陆过),但redux中没有user的_id(说明现在没有登录), 得向后台发请求获取对应的user并保存在redux中
    const userid = Cookies.get('userid')
    const {user} = this.props
    if(userid && !user._id){
      // 发送异步请求, 获取user信息
      this.props.getUser()
    }
  }

  render(){
    // 读取cookie中的userid(原生js也能做, 这里用js-cookie库来做)
    const userid = Cookies.get('userid')

    // 如果没有, 自动重定向到login界面
    if(!userid){
      return <Redirect to='/login' />
    }
    // 如果有, 读取redux中的user
    const {user,unReadCount}=this.props
    // 如果user中没有_id, 返回null(空页面)
    if(!user._id){
      return null // 暂时显示空页面
    }else {
      // 如果user中有_id, 请求根路径时会显示对应界面(根据type和avatar, 计算出重定向的路由路径(主页面或完善页面))
      let path = this.props.location.pathname
      if(path==='/'){ // 必须先判断是否为根目录, 不然main页面的子路由页面都会触发跳转逻辑
         path = getRedirectUrl(user)
        return <Redirect to={path}/>
      }
    }
    const {navList} =this
    const path = this.props.location.pathname
    const currentNav = navList.find(nav=>nav.path===path)

    // 在return之前, 对dashen和laoban进行筛选,与用户类型一致的要添加隐藏属性
    // 先判断currentNav是否存在, 若不存在就没有筛选的必要
    if(currentNav){
        navList.map(nav=>{
          if(nav.icon===user.type) {nav.hidden=true}
        })

    }
    return (
      <div>
        {currentNav?<NavBar>{currentNav.title}</NavBar>:null}
        <Switch>
          {navList.map((item,index)=><Route path={item.path} component={item.component} key={item.path}/>)}
          <Route path='/laobaninfo' component={LaobanInfo}></Route>
          <Route path='/dasheninfo' component={DashenInfo}></Route>
          <Route path='/chat/:userid' component={Chat}></Route>
          <Route component={NotFound}></Route>
        </Switch>
        {currentNav?<NavFooter navList={navList} unReadCount={unReadCount}/>:null}
      </div>
    )
  }
}
export default connect(
    state=>({user:state.user,unReadCount:state.chat.unReadCount}),
  {getUser}

)(Main)

/* Main组件中必须实现的功能:
  1. 实现自动登录
    1). componentDidMount()
      登录过(cookie中有userid),但当前没有登录(redux中的user没有_id), 发请求获取对应user
    2). render()
      1. 如果cookie中没有userid, 直接定向到login
      2. 判断redux中user有没有_id, 没有:则暂时不显示内容, 等请求发完了就会显示
      3. 如果有: 则说明此时已登录, 显示对应界面
      4. 如果当前请求的是根路径: 根据user的相关内容计算得出重定向路径, 并自动跳转
* */