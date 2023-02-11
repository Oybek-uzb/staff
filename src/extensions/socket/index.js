console.log('Socket')
const io = require('socket.io')(strapi.server.httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
})
let _ = null
io.on('connection', function (socket) {
  _ = socket

  socket.on('hi', async (data) => {
    socket.emit('message', 'Salom alekum')
  })

  // socket.on("joinRoom", async ({ username, room }) => {
  //   if (!room) return
  //   try {
  //     const _room = 'room_' + room
  //     socket.join(_room);
  //     io.to(_room).emit("joinedRoom", `${username}, joined to ${room} - room`);
  //   } catch (error) {
  //     socket.emit('error', error)
  //     return
  //   }
  // })
  // socket.on("join", async ({ username, user_id }) => {
  //   try {
  //     const _room_id = 'user' + user_id
  //
  //     socket.join(_room_id);
  //
  //     io.to(_room_id).emit("joined", `${username}, joined to ${_room_id} `);
  //
  //   } catch (error) {
  //     socket.emit('error', error)
  //     return
  //   }
  // })
  // socket.on("leaveRoom", async ({ username, room }) => {
  //   if (!room) return
  //   try {
  //     const _room = 'room_' + room
  //     socket.leave(_room);
  //     socket.emit("leftRoom", `${username}, leave from ${room}`);
  //
  //   } catch (error) {
  //     socket.emit('error', error)
  //     return
  //   }
  // })
  // socket.on("leave", async ({ username, user_id }) => {
  //   try {
  //     const _room_id = 'user' + user_id
  //     socket.leave(_room_id);
  //     socket.emit("left", `${username}, leave from ${_room_id}`);
  //   } catch (error) {
  //     socket.emit('error', error)
  //     return
  //   }
  // })
  //
  // socket.on("createRoom", async (data) => {
  //   try {
  //     const _message = await strapi.entityService.create('api::chatroom.chatroom', {
  //       data: data,
  //       populate: {
  //         branch: true,
  //         sender: true,
  //         receiver: true
  //       }
  //     })
  //
  //     const _send_data = {
  //       type: "room",
  //       status: "created",
  //       data: _message
  //     }
  //     const _sender = 'user' + data.sender
  //     const _receiver = 'user' + data.receiver
  //     io.to([_sender, _receiver]).emit('message', _send_data)
  //   } catch (e) {
  //     socket.emit('error', e)
  //     return e
  //   }
  // })
  // socket.on("editRoom", async ({ id, data }) => {
  //   try {
  //     const _message = await strapi.entityService.update('api::chatroom.chatroom', id,{
  //       data: data,
  //       populate: {
  //         branch: true,
  //         sender: true,
  //         receiver: true
  //       }
  //     })
  //
  //     const _send_data = {
  //       type: "room",
  //       status: "updated",
  //       data: _message
  //     }
  //     const _sender = 'user' + data.sender
  //     const _receiver = 'user' + data.receiver
  //     io.to([_sender, _receiver]).emit('message', _send_data)
  //   } catch (e) {
  //     socket.emit('error', e)
  //     return e
  //   }
  // })
  // socket.on("deleteRoom", async ({ id }) => {
  //   try {
  //     const _data = await strapi.entityService.delete('api::chatroom.chatroom', id, {
  //       populate: '*'
  //     })
  //     const _send_data = {
  //       type: "room",
  //       status: "deleted",
  //       data: _data
  //     }
  //     const _sender = 'user' + _data.sender
  //     const _receiver = 'user' + _data.receiver
  //     io.to([_sender, _receiver]).emit('message', _send_data)
  //   } catch (e) {
  //     socket.emit('error', e)
  //     return e
  //   }
  // })
  //
  // socket.on("sendMessage", async (data) => {
  //   if (!data.room) return
  //   try {
  //     const _room = 'room_' + data.room
  //     const { text, sender, receiver, room, media, seen} = data
  //     const _message = await strapi.entityService.create('api::chatmessage.chatmessage', {
  //       data: {
  //         text: text,
  //         media: media,
  //         seen: seen,
  //         sender: sender,
  //         receiver: receiver,
  //         room: room
  //       },
  //       populate: {
  //         sender: true,
  //         receiver: true
  //       }
  //     })
  //     const _send_data = {
  //       type: "chat",
  //       status: "created",
  //       data: _message
  //     }
  //     io.to(_room).emit('message', _send_data)
  //   } catch (error) {
  //     socket.emit('error', error)
  //     return error
  //   }
  // });
  // socket.on("editMessage", async ({ id, data }) => {
  //   if (!data.room) return
  //   try {
  //     const { room } = data
  //     const _room = 'room_' + room
  //     const _message = await strapi.entityService.update('api::chatmessage.chatmessage', id, {
  //       data: data,
  //       populate: {
  //         sender: true,
  //         receiver: true
  //       }
  //     })
  //     const _send_data = {
  //       type: "chat",
  //       status: "updated",
  //       data: _message
  //     }
  //     io.to(_room).emit('message', _send_data)
  //   } catch (error) {
  //     socket.emit('error', error)
  //     return error
  //   }
  // });
  // socket.on("deleteMessage", async ({ id, room }) => {
  //   if (!room) return
  //   try {
  //     const _room = 'room_' + room
  //     const _message = await strapi.entityService.delete('api::chatmessage.chatmessage', id)
  //     const _send_data = {
  //       type: "chat",
  //       status: "deleted",
  //       data: _message
  //     }
  //     io.to(_room).emit('message', _send_data)
  //
  //   } catch (error) {
  //     socket.emit('error', error)
  //     return error
  //   }
  // });

  socket.on("disconnect", (reason) => {
    console.log("Disconnected Socket: ", reason)
  });

})


module.exports = {
  async orderUpdate (order) {
    _.emit("updatedOrder", order)
  },
  async countUpdate (counts) {
    _.emit("counts", counts)
  }
}
