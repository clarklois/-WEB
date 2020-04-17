const {ChatModel} = require('../db/models')
module.exports = function(server) {
  const io = require('socket.io')(server)

  // 设置监听来自客户端的连接
  io.on('connection', function (socket) {
    console.log('connection detected')

    // 绑定监听,接收客户端消息
    socket.on('sendMsg', function ({from, to, content}) {
      /*自定义监听, 监听名可以自己定, 只要和客户端一致就行,
       然后用回调函数来接收/操作发送的数据*/
      console.log('收到客户端消息',{from, to, content})
      //处理数据(数据库)
      const chatMsg = {
        from, to, content,
        create_time:Date.now(),
        /*这里chat_id的处理方法是:  将from和to放入一个数组中, 进行排序(保证两者永远都有一样的顺序), 再用join方法合并成一个字符串*/
        chat_id:[from,to].sort().join('_')
      }

      new ChatModel(chatMsg).save(function(error,chatMsg){
        /*这次是向所有连接上的客户端发消息, 效率低*/
        console.log('现在向所有用户发送消息',chatMsg)
        io.emit('receiveMsg', chatMsg)
      })


    })
  })
}