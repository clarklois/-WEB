import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import {TabBar} from "antd-mobile";
const TabItem = TabBar.Item
class NavFooter extends Component{
  static propTypes = {
    navList: PropTypes.array.isRequired,
    unReadCount:PropTypes.number.isRequired
  }


  render(){
    const navList= this.props.navList.filter(nav=> nav.hidden!==true)
    return (
        <TabBar>
          {
            navList.map(
              (nav)=> <TabItem
                key={nav.path}
                badge={nav.path==='/message'?this.props.unReadCount:0}
                title={nav.text}
                icon={{uri:require(`./img/${nav.icon}.png`)}}
                selectedIcon={{uri:require(`./img/${nav.icon}-selected.png`)}}
                selected={this.props.location.pathname===nav.path}
                onPress={()=>{this.props.history.replace(nav.path)}}
              />
            )
          }
        </TabBar>
    )
  }
}

export default withRouter(NavFooter)
/*withRouter方法是react-router-dom提供的
将方法中包装的组件向外暴露以后, 就能把路由组件特有的属性: history/location/math等传给包装的组件
 */