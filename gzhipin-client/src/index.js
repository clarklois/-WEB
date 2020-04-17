/*入口js文件*/
import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter,Route,Switch} from "react-router-dom";
import {Provider} from 'react-redux'
import FastClick from 'fastclick'

import store from './redux/store'
import Register from "./containers/register/register"
import Login from './containers/login/login'
import Main from "./containers/main/main"
import './assets/css/index.css'
/*import './test/socketio_test'*/
FastClick.attach(document.body)

ReactDOM.render((
  <Provider store={store}>
      <HashRouter> {/*HashRouter: 路由器标签, 包裹在所有路由组件外面,整个SPA页面只需要一个, 子路由文件不需要包裹*/}
        <Switch>
          <Route path='/register' component={Register}></Route>
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Main}></Route> {/*不写path的话, 说明是默认路由组件*/}
        </Switch>
      </HashRouter>
  </Provider>

  )
  ,document.getElementById('root'))
