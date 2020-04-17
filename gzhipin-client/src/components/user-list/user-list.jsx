/*显示指定用户列表的UI组件*/
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Card,WingBlank,WhiteSpace} from "antd-mobile";
import {withRouter} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'

const Header=Card.Header
const Body = Card.Body
class UserList extends Component{
static propTypes = {
  userList: PropTypes.array.isRequired
}

render(){
  const {userList} = this.props

    return (
      <WingBlank style={{marginBottom:50,marginTop:45}}>
        <QueueAnim type='left' delay={100} leaveReverse>
          {userList.map((user,index)=>
            (
              <div key={index} >
                <WhiteSpace/>
                <Card onClick={()=>this.props.history.push(`/chat/${user._id}`)}>
                  <Header
                    thumb={user.avatar?require(`../../assets/img/${user.avatar}.png`):null}
                    extra={user.username}/>
                  <Body>
                    {user.post?<div>职位:{user.post}</div>:null}
                    {user.company?<div>公司:{user.company}</div>:null}
                    {user.salary?<div>公司:{user.salary}</div>:null}
                    {user.info?<div>描述:{user.info}</div>:null}
                  </Body>
                </Card>
              </div>)
          )}
        </QueueAnim>

      </WingBlank>

    )
}
}
export default withRouter(UserList)