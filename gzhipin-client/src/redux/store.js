/*redux最核心的管理对象模块*/
import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import reducers from './reducers'

export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))
//向外暴露store对象
// 如果没有异步, createStore中的参数只有reducers, applyMiddleWare(thunk)则是使其能传异步action, 在外面包裹composeWithDevTools则是使其能在浏览器中使用reduxdevTools