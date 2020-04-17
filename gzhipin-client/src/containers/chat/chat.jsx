import React,{Component} from 'react'
import {connect} from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import {
  NavBar,
  List,
  InputItem,
  Grid,
  Icon
} from "antd-mobile";

import {sendMsg,aReadMsg} from '../../redux/actions'
const Item = List.Item
class Chat extends Component{
  state = {
    content:'',
    isShown:false
  }
componentWillMount(){
    const emojis = ['😀', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍',
      '🤩', '😘', '😗', '😋', '🤨', '😐', '😑', '🤐', '😏', '🙄', '😴', '😪', '😷', '🤒',
      '😴', '🥵', '🥶', '🥴', '😵', '🤠', '🧐', '😕', '🙁', '😟', '😯', '😣', '🥱', '😤']
    this.emojis =  emojis.map(item=>({text:item}))
}
componentDidMount() { // 刚载入页面时, 滑动到能滑动到的最底端
    window.scrollTo(0,document.body.scrollHeight)// x轴为0, y轴为body.scrollHeight


}
componentDidUpdate() { // 组件更新时(即发送信息/接收信息时)了, 滑到底端
  window.scrollTo(0,document.body.scrollHeight)
}
componentWillUnmount() {
  //  请求, 刷新消息的未读/已读状态
  // 在组件即将退出时调用(而不是在挂载完成时调用), 防止别人发消息时你在chat页面, 退出时又看见"未读消息"
  const to = this.props.user._id
  const from= this.props.match.params.userid // 目标用户id
  this.props.aReadMsg(from,to)
}

  send = ()=>{
      //收集数据
      const from = this.props.user._id
      const to = this.props.match.params.userid
      const content = this.state.content.trim()
      // 发请求
    if(content){
      console.log('发送了',content)
      this.props.sendMsg({from,to,content})
    }
    // 清除数据
    this.setState({content:'',isShown:false})
  }
  toggleShow = () => {
    const isShown = !this.state.isShown
    this.setState({isShown})
    if(isShown) {
      setTimeout(() => { // 采用异步操作, 解决组件显示上出现的bug
      window.dispatchEvent(new Event('resize'))
    }, 0)
    }
  }
  render(){
    const {user}=this.props
    const {users,chatMsgs} = this.props.chat

    if(!users[user._id]){ // 若刷新页面, 会有一小段时间在向后台请求数据, 此时chat路由传来的数据为空, 需要先返回空, 等请求完成, store里的数据刷新以后才会显示
      return null
    }
    const target= this.props.match.params.userid
    const chat_id = [user._id,target].sort().join('_')
    const msgs = chatMsgs.filter(msg=>msg.chat_id===chat_id) // filter方法, 回调会保留值为true的元素
    const avatar = users[target].avatar?require(`../../assets/img/${users[target].avatar}.png`):null
    return (
      <div>
        <NavBar
          icon={<Icon type={'left'}/>}
          onLeftClick={()=>this.props.history.goBack()}
        >
          {users[target].username}
        </NavBar>
        <List style={{marginBottom:50,marginTop:45}}>
          {/*type: alpha, left, right, top, bottom, scale, scaleBig, scaleX, scaleY*/}
          <QueueAnim type='left' delay={100}>
            {msgs.map(msg=>{
              if(msg.from===user._id){
                return (<Item key={msg._id} className={'chat-me'} extra={'我'}>{msg.content}</Item>)

              }
              else if(msg.to===user._id){
                return (<Item key={msg._id} thumb={avatar}>{msg.content}</Item>)
              }
            })}
          </QueueAnim>
        </List>

        <div className={'am-tab-bar'}>
          {
            this.state.isShown?
              <Grid
                data={this.emojis}
                columnNum={8}
                carouselMaxRow={4}
                isCarousel={true}
                onClick={
                  (item)=>{
                    this.setState({content:this.state.content + item.text})
                  }
                }
              />:null
          }
          <InputItem
            extra={
              <span>
                <span onClick={this.toggleShow} style={{marginRight:5}}>🙃</span>
                <span onClick={this.send}>发送</span>
              </span>
            }
            placeholder={'请输入文字'}
            value={this.state.content}
            onChange={content=>this.setState({content})}
            onFocus ={()=>{this.setState({isShown:false})}}
          />

        </div>
      </div>
    )
  }
}

export default connect(
  state=>({user:state.user,chat:state.chat}),
  {sendMsg,aReadMsg}
)(Chat)