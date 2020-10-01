import { Contact, Friendship, Message, Room, Wechaty } from "wechaty"
import { Socket } from "socket.io"
import PuppetPadplus from "wechaty-puppet-padplus"
import { TokenType, ServerStatus } from "../../frontend/src/DS/enums"
import {
  PayloadWxContact,
  ServerItem,
  PayloadStats,
  PayloadWxMessage,
  PayloadWxScan,
  PayloadWxSelf,
  PayloadUser,
  PayloadClientSendMessage,
  PayloadSubmitSettings,
} from "../../frontend/src/DS/interface"
import { Code } from "../../frontend/src/DS/codes"
import {
  writeWechatFriends,
  writeWechatRooms,
  writeWechatSelf,
} from "./db/operations"
import { synchronizeStatus } from "./index"
import { MessageType } from "wechaty-puppet"
import { EventSocket } from "../../frontend/src/DS/actions"

require("dotenv").config()

const defaultWechat: PayloadWxSelf = {
  _id: "",
  id: "",
  avatar: "",
  alias: "",
  city: "",
  friend: true,
  gender: 0,
  name: "",
  phone: [],
  province: "",
  signature: "",
  type: 0,
  weixin: "",
}

class SocketServer {
  /**
   * isFree expire都是基于token的一些固有属性，可通过数据库查询，这里只简单做初始化
   * @private
   */

  // token
  public readonly token: string

  // 输入
  public username: string
  public wechat: PayloadWxSelf
  private bot: Wechaty
  private socket: Socket

  // 状态
  private hasEmittedFriends = false
  private status: ServerStatus = ServerStatus.IDLE
  private tokenType: TokenType = TokenType.PAD
  private isFree?: boolean = true
  private expire: Date = new Date(2020, 9, 31)
  private lastTime: Date = null

  // 属性
  // private friends: Contact[] = []
  private friends: Map<string, Contact> = new Map<string, Contact>()
  private rooms: Map<string, Room> = new Map<string, Room>()
  private settings: PayloadSubmitSettings = {
    prefix: "",
    suffix: "",
  }

  // 统计
  private stats: PayloadStats = { messagesReceived: 0, messagesRecalled: 0 }

  // 计算属性
  get isIdle() {
    return this.status === ServerStatus.IDLE
  }

  get isDaemon() {
    return this.status === ServerStatus.DAEMON
  }

  get avatar() {
    return this.wechat.avatar
  }

  get wxid() {
    return this.wechat.id
  }

  get hasWrittenFriends() {
    return Object.keys(this.friends).length !== 0
  }

  // 方法
  // private onClientLogoutOther: any

  constructor(io, token) {
    this.token = token
    this.init()
  }

  /**
   * used for socket is new but wechat is running
   * @private
   */
  private initSocket() {
    this.socket = null
    this.hasEmittedFriends = false
    this.lastTime = new Date()
  }

  /**
   * used for socket and client all new
   * @private
   */
  private async init() {
    this.initSocket()
    this.username = null
    this.status = ServerStatus.IDLE
    this.wechat = defaultWechat
    this.friends = new Map<string, Contact>()
    this.rooms = new Map<string, Room>()
    if (this.bot) {
      await this.bot.stop()
      this.bot = null
    }
  }

  /**
   * 启动机器人与监听机器人事件
   */
  private async startWechaty() {
    this.status = ServerStatus.CONNECTING
    this.hasEmittedFriends = false

    this.bot = new Wechaty({
      name: (process.env.STORE_DIR || "") + this.username,
      puppet: new PuppetPadplus({ token: this.token }),
    })

    this.bot
      .on(EventSocket.WX_MESSAGE, this.onBotMessage)
      .on(EventSocket.WX_SCAN, this.onBotScan)
      .on(EventSocket.WX_LOGIN, this.onBotLogin)
      .on(EventSocket.WX_LOGOUT, this.onBotLogout)
      .on(EventSocket.WX_START, this.onBotStart)
      .on(EventSocket.WX_STOP, this.onBotStop)
      .on(EventSocket.WX_FRIENDSHIP, this.onBotFriendship)

    await this.bot.start()
  }

  private onBotMessage = async (msg: Message) => {
    console.log("bot received msg: ", msg.toString())
    if (msg.type() === MessageType.Text) {
      // @ts-ignore
      const { payload }: { [key: payload]: PayloadWxContact } = msg.from()
      const msgItem: PayloadWxMessage = {
        id: msg.id,
        roomID: msg.room() && msg.room().id,
        from: payload,
        content: await msg.text(),
        time: new Date(),
      }
      this.socket.emit(EventSocket.WX_MESSAGE, msgItem)
    }
  }

  private onBotScan = (qrcode: string, status: number) => {
    console.log("bot on scan status: ", status)
    const scanEmit: PayloadWxScan = { qrcode, status }
    this.socket.emit(EventSocket.WX_SCAN, scanEmit)
  }

  public onBotReady = async () => {
    await this.bot.say("您好啊，我是您的小川机器人，您的微信已经在后台启动啦！")
    // @ts-ignore
    const selfPayload: PayloadWxContact = this.bot.userSelf().payload
    const welcomeMessage: PayloadWxMessage = {
      id: this.bot.id,
      roomID: null,
      content: `欢迎${this.wechat.name}使用小川机器人，实时消息面板中直接点击就可以快捷回复哦！`,
      time: new Date(),
      from: selfPayload,
    }
    await this.socket.emit(EventSocket.WX_MESSAGE, welcomeMessage)
    await this.socket.emit(EventSocket.SERVER_WECHAT_READY)
  }

  // socket一般比bot先挂，所以bot的操作不要理会socket
  private onBotLogin = async ({ payload }: any) => {
    this.wechat = payload
    this.status = ServerStatus.RUNNING
    await writeWechatSelf(payload)

    // update friends
    if (!this.hasWrittenFriends) {
      const contacts = await this.bot.Contact.findAll()
      for (let contact of contacts) {
        if (contact.friend()) {
          this.friends.set(contact.id, contact)
        }
      }
      await writeWechatFriends(
        this.username,
        this.wxid,
        Array.from(this.friends.values())
      )
    }
    await this.socket.emit(EventSocket.WX_LOGIN, payload)

    // update rooms
    const rooms = await this.bot.Room.findAll()
    for (let room of rooms) {
      this.rooms.set(room.id, room)
    }
    await writeWechatRooms(this.username, this.wxid, rooms)

    await synchronizeStatus()

    await this.onBotReady()
  }

  private onBotLogout = async ({ payload }) => {
    if (this.socket) {
      this.socket.emit(EventSocket.WX_LOGOUT, payload)
    }
    await this.init()
  }

  private onBotStart = () => {
    if (this.socket) {
      this.socket.emit(EventSocket.WX_START)
    }
  }

  private onBotStop = () => {}

  private onBotFriendship = async (friendship: Friendship) => {
    if (this.socket) {
      this.socket.emit(EventSocket.WX_FRIENDSHIP, friendship)
    }
  }

  /**
   * 客户端（浏览器）部分
   * 每一个socket都是一个用户，它们共同订阅SocketBot背后的token，所以可以理解为房间
   * 另一种做法就是维护一个集合，然后每次都遍历发送，个人觉得第一种比较方便，毕竟不需要自己维护
   * 但我最终设计的方案是为了安全考虑，一个微信用户只能对于一个socket，因此多个浏览器之间将造成挤线
   */
  public async bindSocket(socket: Socket, username: string) {
    this.username = username
    this.socket = socket
    this.socket
      .on(EventSocket.CLIENT_DAEMON_SERVER_OR_NOT, this.switchDaemon)
      .on(EventSocket.SERVER_DISCONNECT, this.onClientDisconnected)
      .on(EventSocket.CLIENT_RELEASE_SERVER, this.onClientReleaseServer)
      .on(EventSocket.CLIENT_SEND_WX_MESSAGE, this.onClientSendMessage)
      .on(EventSocket.CLIENT_SUBMIT_SETTINGS, this.onClientSubmitSettings)

    if (!this.bot) {
      console.log("正在启动新的机器人")
      await this.startWechaty()
    } else {
      console.log("直接继承原有的机器人")
      await this.onBotReady()
    }
  }

  private onClientDisconnected = async () => {
    console.log("检测到客户端已断开")
    if (!this.isDaemon) {
      await this.init()
      console.log(Code[Code.SOCKET_DISCONNECTED_NOT_DAEMON])
    } else {
      this.initSocket()
      console.log(Code[Code.SOCKET_DISCONNECTED_WITH_DAEMON])
    }
    await synchronizeStatus()
  }

  private switchDaemon = async (cb: any = null) => {
    if (this.isDaemon) {
      this.status = ServerStatus.RUNNING
    } else {
      this.status = ServerStatus.DAEMON
    }
    await synchronizeStatus()
    cb(Code.SUCCESS)
  }

  private onClientLogout = async () => {
    await this.onClientDisconnected()
  }

  private onClientReleaseServer = async (cb: Function) => {
    if (this.bot) {
      await this.bot.stop()
    }
    this.socket = null
    this.status = ServerStatus.IDLE
    await synchronizeStatus()
    cb(Code.SUCCESS)
  }

  private onClientSendMessage = async (
    payload: PayloadClientSendMessage,
    cb
  ) => {
    try {
      const content =
        (this.settings.prefix || "") +
        payload.content +
        (this.settings.suffix ? `\n${this.settings.suffix}` : "")
      if (payload.isRoom) {
        await this.rooms.get(payload.toID).say(content)
      } else {
        await this.friends.get(payload.toID).say(content)
      }
      cb(Code.SUCCESS)
    } catch (err) {
      console.warn(err)
      cb(Code.FAILED_FOR_UNKNOWN)
    }
  }

  private onClientSubmitSettings = async (payload, cb) => {
    this.settings = payload
    console.log("received submit settings: ", payload)
    cb(Code.SUCCESS)
  }

  /**
   * server导出
   */

  public exportInfo() {
    const serversInfo: ServerItem = {
      token: this.token,
      avatar: this.avatar,
      tokenType: this.tokenType,
      status: this.status,
      isFree: this.isFree,
      username: this.username,
      expire: this.expire,
      messagesReceived: this.stats.messagesReceived,
      messagesRecalled: this.stats.messagesRecalled,
      lastTime: this.lastTime,
    }
    return serversInfo
  }
}

export default SocketServer
