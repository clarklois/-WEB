/*注册路由组件*/
import React,{Component} from 'react'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio,
  Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {register} from '../../redux/actions'

const ListItem=List.Item

class Register extends Component{
state={
  username:'',
  password:'',
  password2:'',
  type:'dashen' // dashen/laoban
}

  register=()=>{
    this.props.register(this.state)

  }
  handleChange=(type,val)=>{
    this.setState({[type]:val})
  }
  render(){
  const {type}=this.state
    const {msg,redirectTo}=this.props.user
    if(redirectTo){// 如果action为成功授权的操作,则返回值中会有redirectTo属性
      // 根据redirectTo属性进行自动跳转
      return <Redirect to={redirectTo}/>
    }
    return (
      <div>
        <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            {msg?<div className='error-msg'>{msg}</div>:null}
            <InputItem placeholder='请输入用户名' type='text' onChange={(val)=> this.handleChange('username',val)}>用户名:</InputItem>
            <InputItem placeholder='请输入密码' type='password' onChange={(val)=> this.handleChange('password',val)}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
            <InputItem placeholder='请输入确认密码' type='password' onChange={(val)=> this.handleChange('password2',val)}>确认密码:</InputItem>
            <ListItem>
              <span>用户类型:</span>&nbsp;&nbsp;
              <Radio checked={type==='dashen'} onChange={(val)=>this.handleChange('type','dashen')}>大神</Radio>&nbsp;&nbsp;
              <Radio checked={type==='laoban'} onChange={(val)=>this.handleChange('type','laoban')}>老板</Radio>
            </ListItem>

          </List>
          <WhiteSpace/>
          <Button type='primary' onClick={this.register}>注册</Button>
          <WhiteSpace/>
          <Button onClick={()=>this.props.history.replace('/login')}>已有账户</Button>
        </WingBlank>
      </div>
    )
  }
}
export default connect(
  state=>({user:state.user}),
  {register}
)(Register)