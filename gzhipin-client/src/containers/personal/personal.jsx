/*个人中心页面的容器组件*/
import React,{Component} from 'react'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {
  Modal,
  Button,
  WhiteSpace,
  Result,
  List
} from "antd-mobile";

import {resetUser} from '../../redux/actions'

const Item=List.Item
const Brief = Item.Brief
const alert= Modal.alert
class Personal extends Component{
logOut = ()=>{
  /*
  * 这里借助antd-mobile中的modal组件来进行弹窗设计(会打断用户操作, 少用)
  * Modal可以直接作为标签写在render()中, 也可以调用封装在其中的三个方法在回调中进行操作
  * 三个方法:
  *   1. alert(): 普通警告弹窗, 如询问是否确认
  *   2. prompt(): 输入弹窗
  *   3. operation(): 操作弹窗
  **/
  // this.props.location.push('/login')
  alert('退出','确认退出登录吗?',[
    {text:'取消',onPress:()=>{console.log('不登出了')}},
    {text:'确认',onPress:()=>{
      Cookies.remove('userid')
      this.props.resetUser()
    }}
  ])
}
  render(){
    const {username,avatar,company,salary,info,post}=this.props.user
    return (
      <div style={{marginBottom:50,marginTop:45}}>
        <Result img={<img src={require(`../../assets/img/${avatar}.png`)} alt={avatar}/>}
                title={username}
                message={company}
        />

        <List renderHeader={()=>'相关信息'}>
          <Item multipleLine>
            <Brief>职位: {post}</Brief>
            <Brief>简介: {info}</Brief>
            {salary?<Brief>薪资: {salary}</Brief>:null}
          </Item>
        </List>
        <WhiteSpace/>
        <Button type='warning' onClick={this.logOut}>退出登录</Button>

      </div>
    )
  }
}
export default connect(
  state=>({user:state.user}),
  {resetUser}
)(Personal)