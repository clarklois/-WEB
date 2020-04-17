/*大神信息完善的路由组件*/
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

class DashenInfo extends Component{
state={
  post:'',
  info:'',
  avatar:''
}
handleChange=(type,val)=>{
  this.setState({[type]:val})
}
setAvatar=(avatar)=>{
  this.setState({avatar})
}
saveAll=()=>{
  this.props.updateUser(this.state)
}
  render(){
    const {avatar,type} = this.props.user
    if(avatar){ // props中的user有avatar属性, 说明信息以及添加成功
      const path = type==='dashen'?'/dashen':'/laoban'
      return <Redirect to={path}/>
    }
    return (
      <div>
        <NavBar>大神信息完善</NavBar>
        <AvatarSelector setAvatar={this.setAvatar}/>
        <List>
          <InputItem placeholder='请输入求职岗位:' onChange={val=>this.handleChange('post',val)}>求职岗位:</InputItem>
          <TextareaItem title='个人介绍:' rows={3} onChange={val=>this.handleChange('info',val)} />
        </List>
        <Button type='primary' onClick={this.saveAll}>保&nbsp;&nbsp;&nbsp;存</Button>
      </div>
    )
  }
}
export default connect(
  state=>({user:state.user}),
  {updateUser}
)(DashenInfo)