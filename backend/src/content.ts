import { ScanMsg, ScanStatus } from "../../frontend/src/interface"
import Bot from "./bot"
import { getImgSrcFromQRCode } from "./utils"

import * as SocketIO from "socket.io"
import { Message } from "wechaty"
import { MessageType } from "wechaty-puppet"

const Koa = require("koa")
const CORS = require("@koa/cors")
const http = require("http")

const app = new Koa().use(CORS())
const server = http.createServer(app).listen(process.env.SOCKET_PORT)
const io = SocketIO(server)

/**
 * 服务器端的设计，主要是维护好wechaty这边码的状态与前端的状态，它将接收两类消息
 */
// 服务器收到来自浏览器发出的ws连接请求
io.on("connection", async (socket) => {
  console.log("Socket " + socket.id + " 上线")
  const socketID = socket.id
  socket.on("disconnect", (socket) => {
    console.log("Socket " + socketID + " 已下线")
  })

  /**
   * 首先处理服务器对于wechaty这边的消息
   * 为了前端速度考虑，每当网页打开则建立一个ws连接，每建立一个，则立即使用机器人渲染二维码信息
   */
  const scan: ScanMsg = {
    status: ScanStatus.Unknown,
    socketID: socket.id,
    qrCode: "",
    imgSrc: "",
  }

  /**
   * 值得注意的是，当bot下线后重新上线，二维码并不会自动刷新。。
   * 因此，任何时刻我们都不应主动清空二维码的缓存，毕竟可以多次使用
   * @param qrCode
   * @param status
   */
  const onBotScan = async (qrCode, status: ScanStatus) => {
    console.log({ status, qrCode })
    scan.status = status
    if (status === ScanStatus.Waiting) {
      scan.qrCode = qrCode
      scan.imgSrc = await getImgSrcFromQRCode(qrCode)
    }
    socket.emit("scan", scan)
  }

  const onBotLogin = async ({ payload }) => {
    /**
     * 这里的登录有两种可能，一种是扫码后确认登录
     * 另一种是重开bot热启动的登录
     */
    socket.emit("loginSuccess", payload)
  }

  const onBotMessage = async (msg: Message) => {
    socket.emit("message", msg)
    if (msg.type() === MessageType.Recalled) {
      const recalledMessage = msg.toRecalled()
      socket.emit("message", { recalledMessage })
    }
  }

  const newBot = async () => {
    const bot = await Bot(".memory_card/" + socket.id, { force: true })
    await bot
      .on("scan", onBotScan)
      .on("login", onBotLogin)
      .on("message", onBotMessage)
      .start()
    return bot
  }

  let bot = await newBot()
  // bot自带的logonoff有延迟，不方便使用
  let botActive = true

  /**
   * 接着处理服务器与浏览器之间的消息
   * 首先是已限定浏览器只允许在非登录状态发起登录请求，因此此处无需做过多的判断处理
   * 甚至，由于用户状态不确定（尤其是游客身份），因此对用户初始化不是理想的设计
   */
  const onClientScan = async () => {
    if (!botActive) {
      console.log("正在重新启动")
      bot = await newBot()
      botActive = true
    }
  }

  const onClientLogout = async () => {
    scan.status = ScanStatus.Unknown
    socket.emit("scan", scan)
    botActive = false
    await bot.logout()
  }

  // 服务器收到来自浏览器的登录请求
  socket.on("scan", onClientScan).on("logout", onClientLogout)
})

// @ts-ignore
console.log(`
-----------------------
|                     |
|  BACKEND  STARTED   |
|                     |
-----------------------                     
`)
