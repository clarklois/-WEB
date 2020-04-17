/*用户选择头像的UI组件*/

import React,{Component} from 'react'
import {List,Grid} from 'antd-mobile'
import PropTypes from 'prop-types'

export default class AvatarSelector extends Component{
 constructor(props){
  super(props)
   this.avatarList= Array.from(new Array(20))
     .map((item,index)=>({
        icon:require(`../../assets/img/头像${index+1}.png`),
       text:`头像${index+1}`
     }))
}
static propTypes={
   setAvatar:PropTypes.func.isRequired
}
state={
   icon:null// 图片对象, 待会要在renderHeader中显示
}
handleClick=({icon,text})=>{
   // 更新自身状态(renderheader内容更新)
    this.setState({icon})
  // 更新laobaninfo的状态, 向后台传信息用
   this.props.setAvatar(text)
}
  render(){
   const {icon}=this.state
    const headerInfo = icon?(<div>已选择头像:<img src={icon}/></div>):'请选择头像'
    const data= Array.from(new Array(20))
      .map((item,index)=>({
        icon:`./img/头像${index+1}.png`,
        text:`头像${index+1}`
      }))
    return(
        <List renderHeader={() => headerInfo}>
          <Grid data={this.avatarList}
                columnNum={5}
                onClick={this.handleClick}
          />
        </List>
    )
  }
}
