import { Socket } from "socket.io"
import { Code } from "../../frontend/src/DS/codes"
import apiServer from "./api"
import SocketServer from "./socket"
import { EventSocket } from "../../frontend/src/DS/actions"
import {
  PayloadRequestServer,
  PayloadUserChat,
} from "../../frontend/src/DS/interface"

require("dotenv").config()
const SUPER_GUESTS = ["cheng cheng"]

/**
 * 启动socket服务器
 */
const io = require("socket.io")(
  require("http").createServer(apiServer().callback()),
  { origins: "*:*" }
).listen(3002)

/**
 * 根据已有token，初始化机器人Map
 */
const tokens = [process.env.PUPPET_PADPLUS_TOKEN]
const socketBotMap = new Map()
for (const token of tokens) {
  socketBotMap.set(token, new SocketServer(io, token))
}

export const synchronizeStatus = () => {
  io.sockets.emit(EventSocket.SERVER_PUSH_STATUS, {
    servers: Array.from(socketBotMap.values()).map((server: SocketServer) =>
      server.exportInfo()
    ),
    clients: io.engine.clientsCount,
  })
  // console.log("synchronized~")
}

/**
 * socket连接仍然有很多不完美的地方，比如无法在连接阶段获取cookie
 * 退而求其次，我已经使用query的方法传送cookie数据
 * @param socket
 */
const onClientConnect = async (socket: Socket) => {
  // 上线
  const username = socket.handshake.query.username

  console.log(`user: ${username || socket.id} has logined.`)
  await synchronizeStatus()

  if (username) {
    const serverMatch: SocketServer = Array.from(socketBotMap.values()).filter(
      (socketBot) => socketBot.username === username
    )[0]
    if (serverMatch) {
      console.log(`老用户直接绑定socket：${username}`)
      await serverMatch.bindSocket(socket, username)
      await synchronizeStatus()
    }
  }

  const onClientRequestServer = async (
    payload: PayloadRequestServer,
    cb?: Function
  ) => {
    const server = socketBotMap.get(payload.server.token)
    const username = payload.user.username
    console.log(`新用户正在绑定socket: ${username}`)
    // 机器人空闲
    if (server.isIdle) {
      console.log("空闲直接抢占")
      await server.bindSocket(socket, username)
      synchronizeStatus()
      return cb(Code.SUCCESS)
    }
    // 属于自己的机器人
    else if (server.username === username) {
      console.log("不空闲，是自己的，直接上")
      await server.bindSocket(socket, username)
      synchronizeStatus()
      return cb(Code.SUCCESS)
    }
    // 贵宾的机器人
    else if (SUPER_GUESTS.includes(server.username)) {
      console.log("不空闲，是特权用户的，拒绝")
      return cb(Code.SERVER_REQUEST_FAIL_FOR_NOT_PRIVILEGE)
    }
    // 抢占普通机器人
    else {
      console.log("不空闲，不是特权用户的，抢占") // TODO：付费抢占的实现
      await server.bindSocket(socket, username)
      synchronizeStatus()
      return cb(Code.SUCCESS)
    }
  }

  // 申请机器人
  socket.on(EventSocket.CLIENT_REQUEST_SERVER, onClientRequestServer)

  // 下线
  socket.on(EventSocket.SERVER_DISCONNECT, () => {
    console.log(`socket of name: ${username} disconnected`)
    synchronizeStatus()
  })

  // 接收全局聊天消息
  socket.on(
    EventSocket.CLIENT_SEND_USER_CHAT,
    (userMessage: PayloadUserChat) => {
      io.emit(EventSocket.SERVER_PUSH_USER_CHAT, userMessage)
      console.log("转发全局消息：" + userMessage.content)
    }
  )
}

/**
 * 开启监听客户端的连接
 */
io.on(EventSocket.SERVER_CONNECTION, onClientConnect)
console.log("started all!")
