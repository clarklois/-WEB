/*消息中心界面容器组件*/
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {List,Badge} from "antd-mobile";
const Item = List.Item
const Brief = Item.Brief
class Message extends Component{

  /*编写函数, 对chatMsgs按照chat_id来分组
  1. 找出每个聊天的latestMsg, 并用一个对象来保存{chat_id:latestMsg,...}
  2. 将所有latestMsg放在一个数组中
  3. 对数组进行排序
   */
  getLatestMsg=(chatMsgs,userid)=>{
    const latestMsgObjs = {}

    chatMsgs.forEach(msg=>{

      if(!msg.read&&msg.to===userid){
        msg.unread=1
      }
      else{
        msg.unread =0
      }
      const chatId = msg.chat_id
      let latestMsg =latestMsgObjs[chatId]
      if(!latestMsgObjs[chatId]){
        latestMsgObjs[chatId]=msg
      }
      else{
        if(msg.create_time>=latestMsgObjs[chatId].create_time){
          latestMsgObjs[chatId]=msg
        }
      }
      latestMsgObjs[chatId].unread = latestMsg?latestMsg.unread+msg.unread:msg.unread

    })


    let latestMsgs = Object.values(latestMsgObjs) // Object的values方法, 能把对象中所有属性值取出放在数组中
    /*latestMsgs = latestMsgs.map(msg=>{
      const chatId = msg.chat_id
      let unread=0
      chatMsgs.forEach(chatMsg=>{
        if(chatMsg.chat_id===chatId){
          unread = chatMsg.read===false?unread+1:unread
        }
      })
      msg.unread = unread
      return msg
    })*/

    // 排序, 按时间降序
    latestMsgs.sort(function(m1,m2){ //sort方法的比较函数, 结果<0: m1在前面; 结果>0, m2在前面
       return m2.create_time-m1.create_time // 若前面减后面, 升序; 后面减前面, 降序(游戏规则: 前面减后面, 说明大的想向后走(赢了就往后走, 输了呆在原地),说明是升序; 反之就是降序)
    })

    return latestMsgs
  }
  render(){
    const {user} = this.props
    const {users,chatMsgs}=this.props.chat

    // 工作1: 对chatMsgs进行分组(按chat_id来分组)
    const latestMsgList = this.getLatestMsg(chatMsgs,user._id)

    return (
      <List style={{marginBottom:50,marginTop:45}}>
        {
          latestMsgList.map(msg=>{
            const currentUserId = msg.to===user._id?msg.from:msg.to
            const currentUser = users[currentUserId]
            return (
              <Item
                key={msg._id}
                extra={<Badge text={msg.unread} overflowCount={99}/>}
                arrow="horizontal"
                thumb={currentUser.avatar?require(`../../assets/img/${currentUser.avatar}.png`):null}
                onClick = {()=>{this.props.history.push(`/chat/${currentUserId}`)}}
              >{msg.content}
                <Brief>{currentUser.username}</Brief>
              </Item>
            )
          }
        )
        }

      </List>
    )
  }
}
export default connect(
  state=>({user:state.user,chat:state.chat}),
  {}
)(Message)