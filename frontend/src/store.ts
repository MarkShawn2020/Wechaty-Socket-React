import {
  Actions,
  CoreStatus,
  PayloadRequestServer,
  PayloadRunningStatus,
  PayloadServerStatus,
  PayloadSubmitSettings,
  PayloadTypes,
  PayloadUser,
  PayloadUserChat,
  PayloadWxContact,
  PayloadWxMessage,
  PayloadWxRoom,
  PayloadWxScan,
  PayloadWxSelf,
  ServerItem,
} from "./DS/interface"
import { applyMiddleware, createStore } from "redux"
import thunk from "redux-thunk"
import io from "socket.io-client"
import moment from "moment"
import { Code } from "./DS/codes"
import { Cookies } from "react-cookie"
import { $http } from "./utils/$http"
import { API, ParamsQueryWechatFriends, ParamsQueryWechatRooms } from "./DS/API"
import { APP_NAME, STATUS, USER, WX_SCAN, WX_SELF } from "./DS/default"
import { CookieKeys, Network, Visibility } from "./DS/enums"
import { ActionTypes, EventBrowser, EventHttp, EventSocket } from "./DS/actions"

moment.locale("zh-cn")
const cookies = new Cookies()

export interface State {
  appName: string
  username: string
  user: PayloadUser
  userMessages: PayloadUserChat[]
  status: CoreStatus
  clients: number
  servers: ServerItem[]
  wxScan: PayloadWxScan
  wxMessages: PayloadWxMessage[]
  wxSelf: PayloadWxSelf
  wxFriends: PayloadWxContact[]
  wxFriendsCount: number
  wxRooms: PayloadWxRoom[]
}

/**
 * Socket核心类
 */
export class CoreSocket {
  private readonly appName = process.env.REACT_APP_NAME || APP_NAME
  private readonly socket: SocketIOClient.Socket

  // todo: 这个username到底是个啥啊，为什么不能直接从user中获取？
  public username: string = ""
  public user: PayloadUser = cookies.get(CookieKeys.user) || USER
  public userMessages: PayloadUserChat[] = []

  public wxSelf: PayloadWxSelf = cookies.get(CookieKeys.wechat) || WX_SELF
  public wxScan: PayloadWxScan = WX_SCAN
  public wxMessages: PayloadWxMessage[] = []
  public wxFriends: PayloadWxContact[] = []
  public wxFriendsCount: number = 0
  public wxRooms: PayloadWxRoom[] = []

  public clients: number = 0
  public servers: ServerItem[] = []

  public status: CoreStatus = STATUS

  /**
   * 定义导出状态
   */
  get state(): State {
    return {
      appName: this.appName,
      username: this.username,
      user: this.user,
      clients: this.clients,
      servers: this.servers,
      wxScan: this.wxScan,
      wxSelf: this.wxSelf,
      wxFriends: this.wxFriends,
      wxFriendsCount: this.wxFriendsCount,
      wxRooms: this.wxRooms,
      wxMessages: this.wxMessages,
      userMessages: this.userMessages,
      status: this.status,
    }
  }

  /**
   * 初始化
   */
  constructor() {
    const socketAddress = process.env.REACT_APP_BACKEND_SOCKET
    if (!socketAddress) throw new Error("server location not configured")
    console.log("connecting to socketAddress: ", socketAddress)
    const user = cookies.get(CookieKeys.user) as PayloadUser
    this.socket = io(socketAddress, {
      query: { username: (user && user.username) || "" },
    })
    this.bindEvents()
  }

  private bindEvents = () => {
    for (let eventSocket in EventSocket) {
      if (EventSocket.hasOwnProperty(eventSocket)) {
        console.log(`event -> ` + eventSocket)
        // @ts-ignore
        const e = EventSocket[eventSocket]
        this.socket.on(e, (payload: PayloadTypes) => {
          socketStore.dispatch({
            type: e,
            payload: payload,
          })
        })
      }
    }
  }

  public handleActions(
    actionType: ActionTypes,
    payload?: PayloadTypes,
    callback?: (code: Code) => void
  ) {
    console.log("action: ", actionType)
    switch (actionType) {
      case EventSocket.SERVER_CONNECTION: {
        break
      }
      case EventSocket.SERVER_CONNECT: {
        break
      }
      case EventSocket.SERVER_DISCONNECT: {
        break
      }
      case EventSocket.CLIENT_REQUEST_SERVER: {
        this.status[Network.ServerRequesting] = true
        this.socket.emit(
          EventSocket.CLIENT_REQUEST_SERVER,
          payload as PayloadRequestServer,
          (code: Code) => {
            if (code === Code.SUCCESS) {
              this.status[Network.ServerRequesting] = false
              this.status[Network.ServerStarting] = true
              console.log("server requested")
            }
            if (callback) {
              callback(code)
            }
          }
        )
        break
      }
      case EventSocket.CLIENT_RELEASE_SERVER: {
        this.status = { ...this.status, [Network.LoggingOut]: true }
        this.socket.emit(EventSocket.CLIENT_RELEASE_SERVER, (code: Code) => {
          console.log("server released")
          this.status = { ...this.status, [Network.LoggingOut]: false }
        })
        break
      }
      case EventSocket.CLIENT_REPLACE_SERVER: {
        // todo
        this.socket.emit(EventSocket.CLIENT_REPLACE_SERVER)
        break
      }
      case EventSocket.CLIENT_DAEMON_SERVER_OR_NOT: {
        this.socket.emit(
          EventSocket.CLIENT_DAEMON_SERVER_OR_NOT,
          (code: Code) => {
            console.log("切换托管状态完成")
          }
        )
        break
      }
      case EventSocket.CLIENT_SEND_USER_CHAT: {
        this.socket.emit(EventSocket.CLIENT_SEND_USER_CHAT, payload)
        break
      }
      case EventSocket.SERVER_PUSH_USER_CHAT: {
        this.userMessages = [...this.userMessages, payload as PayloadUserChat]
        break
      }
      case EventSocket.CLIENT_SEND_WX_MESSAGE: {
        this.socket.emit(
          EventSocket.CLIENT_SEND_WX_MESSAGE,
          payload,
          (code: Code) => {
            if (callback) {
              callback(code)
            }
          }
        )
        break
      }
      case EventSocket.SERVER_PUSH_STATUS: {
        const { clients, servers } = payload as PayloadServerStatus
        this.status[Network.BackendConnected] = true
        this.clients = clients
        this.servers = servers
        break
      }

      case EventSocket.WX_SCAN: {
        this.wxScan = payload as PayloadWxScan
        this.status[Visibility.ScanModal] = true
        break
      }
      case EventSocket.WX_LOGIN: {
        this.user.hasLogined = true
        this.wxSelf = payload as PayloadWxSelf
        this.status[Visibility.ScanModal] = false
        this.status[Network.ServerStarting] = false
        this.status[Network.RobotRunning] = true
        cookies.set(CookieKeys.wechat, this.wxSelf)
        break
      }
      case EventSocket.WX_LOGOUT: {
        this.status[Network.RobotRunning] = false
        console.log("微信已下线")
        console.log({ payload })
        break
      }
      case EventSocket.WX_MESSAGE: {
        this.wxMessages = [...this.wxMessages, payload as PayloadWxMessage]
        break
      }
      case EventSocket.SERVER_WECHAT_READY: {
        this.status[Network.FriendsPulling] = true
        this.fetchFriendsCount().then()
        // this.fetchFriends().then()
        this.fetchRooms().then()
        break
      }
      case EventBrowser.SWITCH_STATUS: {
        const { key, toState } = payload as PayloadRunningStatus
        if (toState === undefined)
          this.status = {
            ...this.status,
            [key]: !this.status[key],
          }
        else this.status = { ...this.status, [key]: toState }
        break
      }
      case EventBrowser.UPDATE_USER: {
        this.user = { ...(payload as PayloadUser) }
        if (this.user.remember) {
          cookies.set(CookieKeys.user, this.user)
        }
        console.log("更新用户状态成功")
        break
      }
      case EventHttp.FETCH_FRIENDS: {
        // todo: 由于对redux-thunk不是很熟悉，这个函数暂时没用上，
        //  直接在BOT_LOGIN函数中处理了
        break
      }
      case EventHttp.FETCH_FRIENDS_SUCCESS: {
        this.wxFriends = payload as PayloadWxContact[]
        this.status[Network.FriendsPulling] = false
        console.log("拉取好友数据完成，数目: ", this.wxFriends.length)
        break
      }
      case EventHttp.FETCH_FRIENDS_ERROR: {
        console.log("拉取好友数据失败，报错如下")
        console.warn(payload)
        break
      }
      case EventHttp.FETCH_FRIENDS_COUNT_SUCCESS: {
        this.wxFriendsCount = payload as number
        break
      }
      case EventHttp.FETCH_MORE_FRIENDS_SUCCESS: {
        this.wxFriends = [...this.wxFriends, ...(payload as any)]
        break
      }
      case EventHttp.FETCH_ROOMS_SUCCESS: {
        this.wxRooms = payload as PayloadWxRoom[]
        console.log("拉取群组数据完成，数目: ", this.wxRooms.length)
        break
      }
      case EventHttp.FETCH_ROOMS_ERROR: {
        console.log("拉取群组数据失败，报错如下：")
        console.warn(payload)
        break
      }
      case EventSocket.WX_START: {
        break
      }
      case EventSocket.WX_STOP: {
        break
      }
      case EventSocket.WX_FRIENDSHIP: {
        break
      }
      case EventSocket.CLIENT_REFRESH_CONTACTS: {
        break
      }
      case EventSocket.CLIENT_SUBMIT_SETTINGS: {
        this.socket.emit(
          EventSocket.CLIENT_SUBMIT_SETTINGS,
          payload as PayloadSubmitSettings,
          (code: Code) => {
            console.log({ code })
          }
        )
        break
      }
      default:
        break
    }
  }

  private async fetchFriendsCount() {
    // @ts-ignore
    return socketStore.dispatch((dispatch: any) => {
      $http
        .get(API.wechat.contactsCount, { params: { wxid: this.wxSelf.id } })
        .then(({ data }: any) => {
          return dispatch({
            type: EventHttp.FETCH_FRIENDS_COUNT_SUCCESS,
            payload: data,
          })
        })
    })
  }

  private async fetchFriends() {
    console.log("正在拉取好友数据")
    const params: ParamsQueryWechatFriends = {
      wxid: this.wxSelf.id,
      skip: 0,
      limit: 100,
      onlyFriends: true,
    }
    // @ts-ignore
    return socketStore.dispatch((dispatch) =>
      $http
        .get(API.wechat.friends, { params })
        .then(({ data }: { data: any }) => {
          dispatch({
            type: EventHttp.FETCH_FRIENDS_SUCCESS,
            payload: data as PayloadWxContact[],
          })
        })
        .catch((err: any) => {
          dispatch({
            type: EventHttp.FETCH_FRIENDS_ERROR,
            payload: err,
          })
        })
    )
  }

  private async fetchRooms() {
    console.log("正在拉取群数据")
    const params: ParamsQueryWechatRooms = {
      wxid: this.wxSelf.id,
      limit: 1000,
    }
    // @ts-ignore
    return socketStore.dispatch((dispatch) =>
      $http
        .get(API.wechat.rooms, { params })
        .then(({ data }: { data: any }) => {
          dispatch({
            type: EventHttp.FETCH_ROOMS_SUCCESS,
            payload: data,
          })
        })
        .catch((err) => {
          dispatch({
            type: EventHttp.FETCH_ROOMS_ERROR,
            payload: err,
          })
        })
    )
  }
}

const socketClass = new CoreSocket()
const SOCKET_STATE: State = socketClass.state
console.log({ INITIALIZED_STORE: SOCKET_STATE })

/**
 * 批量匹配
 * @param state: State
 * @param action: Actions
 */
export const reducer = (
  state: State = SOCKET_STATE, // DEFAULT
  action: Actions
) => {
  socketClass.handleActions(action.type, action.payload, action.callback)
  return socketClass.state
}

const socketStore = createStore(reducer, applyMiddleware(thunk))
if (socketClass.user.hasLogined) {
  socketStore.dispatch({
    type: EventSocket.CLIENT_SEND_USER_CHAT,
    payload: {
      username: "SYSTEM",
      content: `${socketClass.user.username}已上线`,
      time: new Date(),
    },
  })
}
export default socketStore
