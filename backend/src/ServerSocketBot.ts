import { Contact, Friendship, Message, Wechaty } from "wechaty"
import { Socket } from "socket.io"
import PuppetPadplus from "wechaty-puppet-padplus"
import {
  ScanDataType,
  ServerItem,
  Stats,
  TokenType,
} from "../../frontend_create-react-app/src/interface"
import { Code } from "../../frontend_create-react-app/src/interface/codes"
import {
  EventFromWechaty,
  EventFromClient,
  EventFromServer,
} from "../../frontend_create-react-app/src/interface/events"
import { fetchUserContacts, updateUserContacts } from "./db/operations"
require("dotenv").config()

class ServerSocketBot {
  /**
   * isFree expire都是基于token的一些固有属性，可通过数据库查询，这里只简单做初始化
   * @private
   */
  // 状态
  private isIdle: boolean = true
  private isDaemon: boolean = false
  private hasContactsUpdated = false

  // 账户
  public name: string = null
  public readonly token: string

  // 用户
  private avatar: string = ""

  // 属性
  private tokenType: TokenType = TokenType.PAD
  private isFree?: boolean = true
  private expire: Date = new Date(2020, 9, 31)

  // 统计
  private stats: Stats = { messagesReceived: 0, messagesRecalled: 0 }

  // 对象
  private bot: Wechaty
  private socket: Socket

  constructor(token) {
    this.token = token
  }

  /**
   * 启动机器人与监听机器人事件
   */
  public async bindWechat(username: string) {
    this.name = username
    this.isIdle = false
    this.hasContactsUpdated = false

    this.bot = new Wechaty({
      name: (process.env.STORE_DIR || "") + username,
      puppet: new PuppetPadplus({ token: this.token }),
    })

    this.bot
      .on(EventFromWechaty.BOT_MESSAGE, this.onBotMessage)
      .on(EventFromWechaty.BOT_SCAN, this.onBotScan)
      .on(EventFromWechaty.BOT_LOGIN, this.onBotLogin)
      .on(EventFromWechaty.BOT_LOGOUT, this.onBotLogout)
      .on(EventFromWechaty.BOT_START, this.onBotStart)
      .on(EventFromWechaty.BOT_STOP, this.onBotStop)
      .on(EventFromWechaty.BOT_FRIENDSHIP, this.onBotFriendship)

    await this.bot.start()
  }

  private onBotMessage = (msg: Message) => {
    console.log("bot received msg: ", msg.toString())
    this.socket.emit(EventFromWechaty.BOT_MESSAGE, msg)
  }

  private onBotScan = (qrcode: string, status: number) => {
    console.log("bot on scan status: ", status)
    const scanEmit: ScanDataType = { qrcode, status }
    this.socket.emit(EventFromWechaty.BOT_SCAN, scanEmit)
  }

  /**
   * 登录后，会有很多事可以做，例如：
   * - 获取所有好友列表
   * socket一般比bot先挂，所以bot的操作不要理会socket
   * @param payload
   */
  private onBotLogin = async ({ payload }) => {
    if (this.socket) {
      // 登录后，还有很多事可以做：
      await this.socket.emit(EventFromWechaty.BOT_LOGIN, payload)
      if (!this.hasContactsUpdated) {
        // 联系数据存入数据库
        await updateUserContacts(this.name, await this.bot.Contact.findAll())
        this.hasContactsUpdated = true
      }
    }
  }

  private onBotLogout = ({ payload }) => {
    if (this.socket) {
      this.socket.emit(EventFromWechaty.BOT_LOGOUT, payload)
    }
  }

  private onBotStart = () => {
    if (this.socket) {
      this.socket.emit(EventFromWechaty.BOT_START)
    }
  }

  private onBotStop = () => {
    this.name = null
  }

  private onBotFriendship = async (friendship: Friendship) => {
    if (this.socket) {
      this.socket.emit(EventFromWechaty.BOT_FRIENDSHIP, friendship)
    }
  }

  /**
   * wechaty的用户数据挖掘
   */

  // private onRequestContacts = async (skip = 0, limit = 100) => {
  //   const contacts = await fetchUserContacts(this.name, skip, limit, true)
  //   this.socket.emit(EventFromServer.ServerBackContacts, contacts)
  //   if (contacts.length === limit) {
  //     setTimeout(() => this.onRequestContacts(skip + limit, limit), 100)
  //   }
  // }

  /**
   * 客户端（浏览器）部分
   * 每一个socket都是一个用户，它们共同订阅SocketBot背后的token，所以可以理解为房间
   * 另一种做法就是维护一个集合，然后每次都遍历发送，个人觉得第一种比较方便，毕竟不需要自己维护
   * 但我最终设计的方案是为了安全考虑，一个微信用户只能对于一个socket，因此多个浏览器之间将造成挤线
   */
  public async bindSocket(socket: Socket) {
    this.socket = socket
    this.socket
      .on(EventFromClient.ClientControlServerDaemon, () =>
        this.onSocketSwitchDaemon(true)
      )
      .on(EventFromClient.ClientControlServerDaemonCancel, () =>
        this.onSocketSwitchDaemon(false)
      )
      .on(EventFromClient.ClientReleaseServer, this.onClientLogout)
      .on(EventFromClient.ClientDisconnect, this.onClientDisconnect)
  }

  private onSocketSwitchDaemon(daemonChoice: boolean, cb: any = null) {
    this.isDaemon = true
    cb(Code.SUCCESS)
  }

  private async onClientLogout() {
    this.socket = null
    if (!this.isDaemon) {
      await this.bot.stop()
      this.isIdle = true
    } else {
    }
  }

  private onClientDisconnect = async () => {
    if (!this.isDaemon) {
      console.log(Code[Code.SOCKET_DISCONNECTED_NOT_DAEMON])
      this.isIdle = true
      this.socket = null
      await this.bot.stop()
    } else {
      this.socket = null
      console.log(Code[Code.SOCKET_DISCONNECTED_WITH_DAEMON])
    }
  }

  /**
   * server导出
   */
  public exportInfo() {
    const serversInfo: ServerItem = {
      key: this.token,
      token: this.token,
      avatar: this.avatar,
      tokenType: this.tokenType,
      isIdle: this.isIdle,
      isFree: this.isFree,
      isDaemon: this.isDaemon,
      name: this.name,
      expire: this.expire,
      messagesReceived: this.stats.messagesReceived,
      messagesRecalled: this.stats.messagesRecalled,
    }
    return serversInfo
  }
}

export default ServerSocketBot
