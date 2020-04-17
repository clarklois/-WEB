import io from 'socket.io-client'
/*注意io是一个函数*/
// 连接服务器,得到与服务器的连接对象
const socket = io('ws://localhost:4000')
/*操作进行到此, 客户端已经连接上了websocket服务器, 并建立了socket通信对象*/

// 客户端发送消息
socket.emit('sendmsg',{username:'孙悟空',type:'dashen'})

// 绑定监听, 接收服务器发送的消息
socket.on('receivedmsg',function(data){
  console.log(data)
})