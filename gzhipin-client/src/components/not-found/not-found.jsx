/*未找到用户时界面组件*/
import React,{Component} from 'react'
import {Button} from "antd-mobile";

export default class NotFound extends Component{

  render(){
    return (
      <div>
        <h2>抱歉,找不到该界面</h2>
        <Button
          type='primary'
          onClick={()=>this.props.history.replace('/')}
        >
          回到首页
        </Button>
      </div>
    )
  }
}