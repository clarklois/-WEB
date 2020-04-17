module.exports = function(server){
  const io = require('socket.io')(server)

  // 设置监听来自客户端的连接
  io.on('connection',function(socket){
    console.log('connection detected')

    // 绑定监听,接收客户端消息
    socket.on('sendmsg',function(data){
      /*自定义监听, 监听名可以自己定, 只要和客户端一致就行,
       然后用回调函数来接收/操作发送的数据*/
      console.log('message got:',data)
      data.type = data.type.toUpperCase()
      socket.emit('receivedmsg',data.username+' is a '+data.type)
    })
  })


}

