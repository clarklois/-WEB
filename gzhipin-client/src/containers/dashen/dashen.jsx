/*老板主界面路由容器组件*/
import React,{Component} from 'react'
import {connect} from 'react-redux'



import UserList from "../../components/user-list/user-list";
import {getUserList} from '../../redux/actions'
class Dashen extends Component{
  componentDidMount() {
    // 获取userList
    this.props.getUserList('laoban')
  }

  render(){
    const {userList} = this.props
    return (
      <div>
        <UserList userList={userList}/>
      </div>
    )
  }
}
export default connect(
  state=>({userList:state.userList}),
  {getUserList}
)(Dashen)