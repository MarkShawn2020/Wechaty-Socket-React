import {
  Network,
  ScanStatus,
  ServerStatus,
  TokenType,
  Visibility,
} from "./enums"
import { Action } from "redux"
import { ActionTypes } from "./actions"
import { Code } from "./codes"

export interface ServerItem {
  token: string
  status: ServerStatus
  avatar: string // 用于前端显示需要
  tokenType: TokenType
  isFree: boolean
  username: string
  expire: Date
  messagesReceived: number
  messagesRecalled: number
  lastTime: Date
}

export interface UserLogin {
  username: string
  password: string
  remember: boolean
  hasLogined?: boolean
  deadTime?: Date
}

export interface UserRegister extends UserLogin {}

export interface SecretData {
  dataEncoded: string
}

export interface CookieData {
  username: string
  wxid?: string
}

/**
 * Core
 */

export interface CoreStatus {
  [Network.FriendsPulling]: boolean
  [Network.RoomsPulling]: boolean
  [Network.BackendConnected]: boolean
  [Network.RobotRunning]: boolean
  [Network.ServerRequesting]: boolean
  [Network.ServerStarting]: boolean
  [Visibility.LoginModal]: boolean
  [Network.LoggingOut]: boolean
  [Visibility.FeedbackModal]: boolean
  [Visibility.ScanModal]: boolean
}

/**
 * Payload for Action
 */
export interface PayloadStats {
  messagesReceived: number
  messagesRecalled: number
  lifetime?: Date
}

export interface PayloadUserChat {
  username: string
  content: string
  time: Date
  ip?: string
  wxid?: string
}

export interface PayloadUser {
  username: string
  hasLogined: boolean
  remember: boolean
  deadTime?: Date
}

export interface PayloadServerStatus {
  clients: number
  servers: ServerItem[]
}

export interface PayloadRunningStatus {
  key: Visibility | Network
  toState: boolean
}

export interface PayloadWxSelf {
  _id?: string
  id: string
  friend: boolean
  gender: number
  type: number
  phone: string[]
  alias: string
  avatar: string
  city: string
  name: string
  province: string
  signature: string
  weixin: string
}

export interface PayloadWxScan {
  qrcode: string
  status: ScanStatus
}

export interface PayloadWxMessage {
  id: string
  roomID: string
  from: PayloadWxContact
  content: string
  time: Date
}

export interface PayloadWxContact {
  id: string
  name: string
  alias: string
  gender: number
  weixin?: string
  friend: boolean
  avatar: string
}

export interface PayloadWxRoom {
  id: string
  topic: string
  ownerId: string
  avatar: string
  members?: number
}

export interface PayloadRequestServer {
  user: PayloadUser
  server: ServerItem
}

export interface PayloadClientSendMessage {
  content: string
  toID: string
  time?: Date
  isRoom: boolean
}

export interface PayloadSubmitSettings {
  prefix: string
  suffix: string
}

export type PayloadTypes =
  | number
  | string
  | boolean
  | PayloadRunningStatus
  | PayloadUserChat
  | PayloadServerStatus
  | PayloadUser
  | PayloadWxSelf
  | PayloadWxScan
  | PayloadWxMessage
  | PayloadWxContact[]
  | PayloadWxRoom[]
  | PayloadRequestServer
  | PayloadClientSendMessage
  | PayloadSubmitSettings

export interface Actions extends Action {
  type: ActionTypes
  payload?: PayloadTypes
  callback?: (code: Code) => void
}
