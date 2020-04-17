/*老板信息完善的路由组件*/

import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {
  NavBar,
  InputItem,
  TextareaItem,
  Button,
  List
} from 'antd-mobile'

import AvatarSelector from "../../components/avatar-selector/avatar-selector";
import {updateUser} from '../../redux/actions'
class LaobanInfo extends Component{

  state={
    post:'',
    salary:'',
    company:'',
    info:'',
    avatar:''
  }
  handleChange=(type,val)=>{
    this.setState({[type]:val})
  }
  saveAll = ()=>{
    this.props.updateUser(this.state)
  }
  // 获取头像
  setAvatar=(avatar)=>{
    this.setState({avatar})
  }
  render(){
    const {avatar,type} = this.props.user
    if(avatar){ // props中的user有avatar属性, 说明信息以及添加成功
      const path = type==='dashen'?'/dashen':'/laoban'
      return <Redirect to={path}/>
    }
    return (
      <div>
      <NavBar>老板信息完善</NavBar>
      <AvatarSelector setAvatar={this.setAvatar}/>
      <List>
        <InputItem placeholder='请输入招聘职位' onChange={val => this.handleChange('post',val)}>招聘职位:</InputItem>
        <InputItem placeholder='请输入公司名称' onChange={val => this.handleChange('company',val)}>公司名称:</InputItem>
        <InputItem placeholder='请输入职位薪资' onChange={val => this.handleChange('salary',val)}>职位薪资:</InputItem>
        <TextareaItem title='职位要求:' rows={3} onChange={val=>this.handleChange('info',val)}/>
      </List>
        <Button type='primary' onClick={this.saveAll}>保&nbsp;&nbsp;&nbsp;存</Button>
      </div>
    )
  }
}
export default connect(
  state=>({user:state.user}),
  {updateUser}
)(LaobanInfo)