import io from "socket.io-client"
import { EventFromServer, EventFromWechaty } from "../../data-sctructure/events"
import { Code } from "../../data-sctructure/codes"

export class CompSocket {
  private username: string | undefined
  private socket: SocketIOClient.Socket | undefined

  // Bot是来自wechaty的消息
  private readonly onBotScan
  private readonly onBotLogin
  private readonly onBotMessage

  private readonly onServersNow
  private readonly onClientsNow

  // Server是对socket服务器的操作
  private readonly emitServerRequest
  private readonly emitServerLogoutSelf
  private readonly emitServerLogoutOther
  private readonly emitServerDaemon
  private readonly emitServerDaemonCancel

  // Fetch是对http服务器的操作
  private readonly fetchServers
  private readonly fetchContacts

  constructor(
    onMethods: {
      onBotScan: any
      onBotLogin: any
      onBotMessage: any
      onServersNow: any
      onClientsNow: any
    },
    emitMethods: {
      emitServerRequest: any
      emitServerDaemon: any
      emitServerDaemonCancel: any
      emitServerRequestLogoutSelf: any
      emitServerRequestLogoutOther: any
    },
    fetchMethods: {
      fetchServers?: any
      fetchContacts: any
    }
  ) {
    this.onBotScan = onMethods.onBotScan
    this.onBotLogin = onMethods.onBotLogin
    this.onBotMessage = onMethods.onBotMessage

    this.onServersNow = onMethods.onServersNow
    this.onClientsNow = onMethods.onClientsNow

    this.emitServerRequest = emitMethods.emitServerRequest
    this.emitServerLogoutSelf = emitMethods.emitServerRequestLogoutSelf
    this.emitServerLogoutOther = emitMethods.emitServerRequestLogoutOther
    this.emitServerDaemon = emitMethods.emitServerDaemon
    this.emitServerDaemonCancel = emitMethods.emitServerDaemonCancel
    this.fetchContacts = fetchMethods.fetchContacts
    this.fetchServers = fetchMethods.fetchServers
  }

  /**
   * socket connection reference: https://socket.io/docs/client-api/
   */
  public initWechaty(username: string) {
    this.username = username
    const socket = io("ws://localhost:3002", {
      transports: ["websocket"], // 或许可以加快连接
    })
    console.log(" socket established")
    this.socket = socket

    socket.on("reconnect_attempt", () => {
      socket.io.opts.transports = ["polling", "websocket"]
    })

    socket.on("connection", () => {
      console.log("socket connected!")
    })

    socket.on(EventFromWechaty.BOT_SCAN, this.onBotScan)
    socket.on(EventFromWechaty.BOT_LOGIN, this.onBotLogin)
    socket.on(EventFromWechaty.BOT_MESSAGE, this.onBotMessage)
    socket.on(EventFromServer.ServersNow, this.onServersNow)
    socket.on(EventFromServer.ClientsNow, this.onClientsNow)
  }

  public emitEvent = (e: string, ...args: any) => {
    if (this.socket) {
      this.socket.emit(e, ...args)
    }
  }

  get name() {
    return this.username
  }

  get isSocketInitialized() {
    return this.socket !== undefined
  }
}
