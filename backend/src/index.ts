import { Socket } from "socket.io"
import { ServerItem } from "../../frontend_create-react-app/src/interface"
import { Code } from "../../frontend_create-react-app/src/interface/codes"

import apiServer from "./api"
import ServerSocketBot from "./ServerSocketBot"
import { EventFromClient } from "../../frontend_create-react-app/src/interface/events"

require("dotenv").config()

const specialNames = ["cheng cheng"]
const tokens = [process.env.PUPPET_PADPLUS_TOKEN]
const socketBots = tokens.map((token) => new ServerSocketBot(token))

const onClientConnect = (socket: Socket) => {
  const username = socket.handshake.query.username
  console.log(`Socket ${username} connected`)

  /**
   * 新用户基于手动刷新
   */
  socket.on(
    EventFromClient.ClientRequestServer,
    async (serverItem: ServerItem, cb: Function) => {
      console.log(socketBots, serverItem)
      const server: ServerSocketBot = socketBots.filter(
        (socketBot) => socketBot.token === serverItem.token
      )[0]
      if (server) {
        // 在有服务器匹配的情况下
        if (serverItem.isIdle) {
          console.log("空闲直接抢占")
          await server.bindSocket(socket)
          await server.bindWechat(username)
          await cb(Code.SUCCESS)
        } else {
          if (server.name === username) {
            console.log("不空闲，是自己的，直接上")
            await server.bindSocket(socket)
            await cb(Code.SUCCESS)
          } else {
            if (specialNames.includes(server.name)) {
              console.log("不空闲，是特权用户的，拒绝")
              await cb(Code.SERVER_REQUEST_FAIL_FOR_NOT_PRIVILEGE)
            } else {
              console.log("不空闲，不是特权用户的，抢占") // TODO：付费抢占的实现
              await server.bindSocket(socket)
              await server.bindWechat(username)
              await cb(Code.SUCCESS)
            }
          }
        }
      } else {
        console.log({ server })
      }
    }
  )
}

const onFetchServers = () => {
  return socketBots.map((server) => server.exportInfo())
}

const app = apiServer(onFetchServers)

const io = require("socket.io")(
  require("http").createServer(app.callback())
).listen(3002)

io.on("connection", onClientConnect)
