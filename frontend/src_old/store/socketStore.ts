import { Contact, Message } from "wechaty"
import {
  ScanDataType,
  ServerItem,
  WechatAccountItem,
} from "../data-sctructure/interface"
import {
  EventFromClient,
  EventFromServer,
  EventFromWechaty,
} from "../data-sctructure/events"
import { createStore } from "redux"
import io from "socket.io-client"

export interface SocketState {
  username: string
  isServerConnected: boolean
  clientCount: number
  serverArray: ServerItem[]
  wechatBasic: WechatAccountItem
  wechatScan: ScanDataType
  wechatMessages: Message[]
  wechatContacts: Contact[]
}

export class SocketStore {
  public username: string = ""

  public wechatBasic: WechatAccountItem = null as any
  public wechatyScanData: ScanDataType = null as any
  public wechatyMessages: Message[] = []
  public wechatyContacts: Contact[] = []

  public clientCount: number = 0
  public serverArray: ServerItem[] = []

  private readonly socket: SocketIOClient.Socket

  constructor() {
    this.socket = io("ws://localhost:3002")
    this.socket
      .on(EventFromWechaty.BOT_SCAN, (scanData: ScanDataType) => {
        this.wechatyScanData = scanData
      })
      .on(EventFromWechaty.BOT_MESSAGE, (message: Message) => {
        this.wechatyMessages.push(message)
      })
      .on(EventFromWechaty.BOT_LOGIN, (userPayload: WechatAccountItem) => {
        this.wechatBasic = userPayload
      })
      .on(EventFromServer.ServerConnected, () => {
        console.log("服务器已连接")
      })
      .on(EventFromServer.ServerDisconnected, () => {
        console.log("服务器已断开！")
      })
      .on(EventFromServer.ServersNow, (servers: ServerItem[]) => {
        this.serverArray = servers
      })
      .on(EventFromServer.ClientsNow, (clients: number) => {
        this.clientCount = clients
      })
  }

  public updateUsername = (username: string) => {
    this.username = username
  }

  public updateWechatBasic = (wechatBasic: WechatAccountItem) => {
    this.wechatBasic = wechatBasic
  }

  public requestServer = () => {
    this.socket.emit(EventFromClient.ClientRequestServer)
  }

  public releaseServer = () => {
    this.socket.emit(EventFromClient.ClientRequestServerLogoutSelf)
  }

  public daemonServer = () => {
    this.socket.emit(EventFromClient.ClientControlServerDaemon)
  }

  get isServerConnected() {
    return this.username !== ""
  }

  get state(): SocketState {
    return {
      username: this.username,
      isServerConnected: this.isServerConnected,
      clientCount: this.clientCount,
      serverArray: this.serverArray,
      wechatScan: this.wechatyScanData,
      wechatBasic: this.wechatBasic,
      wechatContacts: this.wechatyContacts,
      wechatMessages: this.wechatyMessages,
    }
  }
}

export enum socketActionType {
  updateUsername,
  updateWechatBasic,
  requestServer,
  releaseServer,
  daemonServer,
}

export interface socketAction {
  type: socketActionType
  payload: any
}

const socketClass = new SocketStore()
const SOCKET_STATE = socketClass.state
console.log({ defaultState: SOCKET_STATE })

export const reducer = (
  state: SocketState = SOCKET_STATE, // DEFAULT
  action: socketAction
) => {
  switch (action.type) {
    case socketActionType.updateUsername: {
      socketClass.updateUsername(action.payload)
      return socketClass.state
    }
    case socketActionType.updateWechatBasic: {
      socketClass.updateWechatBasic(action.payload)
      return socketClass.state
    }
    case socketActionType.requestServer: {
      socketClass.requestServer()
      return socketClass.state
    }
    case socketActionType.releaseServer: {
      socketClass.releaseServer()
      return socketClass.state
    }
    case socketActionType.daemonServer: {
      socketClass.daemonServer()
      return socketClass.state
    }
    default:
      // !important
      return socketClass.state
  }
}

const socketSore = createStore(reducer)
export default socketSore
