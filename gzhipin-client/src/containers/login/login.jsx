/*登录路由组件*/
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio,
  Button
} from 'antd-mobile'

import {login} from '../../redux/actions'

import Logo from '../../components/logo/logo'
const ListItem=List.Item

class Login extends Component{
  state={
    username:'',
    password:'',
  }
  login=()=>{
   this.props.login(this.state)
  }
  handleChange=(type,val)=>{
    this.setState({[type]:val})
  }
  render(){

    const {msg,redirectTo}=this.props.user
    if(redirectTo){
      return <Redirect to={redirectTo}/>
    }
    return (
      <div>
        <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
        <Logo />
        <WingBlank>
          <List>
            {msg?<div className='error-msg'>{msg}</div>:null}
            <InputItem placeholder='请输入用户名' type='text' onChange={(val)=> this.handleChange('username',val)}>用户名:</InputItem>
            <InputItem placeholder='请输入密码' type='password' onChange={(val)=> this.handleChange('password',val)}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
          </List>
          <WhiteSpace/>
          <Button type='primary' onClick={this.login}>登录</Button>
          <WhiteSpace/>
          <Button onClick={()=>this.props.history.replace('/register')}>还没有账户</Button>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state=>({user:state.user}),
  {login}
)(Login)