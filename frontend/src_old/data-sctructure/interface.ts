import { ScanStatus, TokenType } from "./enums"

export interface ServerItem {
  key: string
  token: string
  avatar: string // 用于前端显示需要
  tokenType: TokenType
  isIdle: boolean
  isFree: boolean
  isDaemon: boolean
  username: string
  expire: Date
  messagesReceived: number
  messagesRecalled: number
}

export interface WechatAccountItem {
  _id?: string
  key?: string
  friend: boolean
  gender: number
  type: number
  phone: string[]
  alias: string
  avatar: string
  city: string
  id: string
  name: string
  province: string
  signature: string
  weixin: string
}

export interface ContactItem {
  id: string
  key: string
  name: string
  alias: string
  gender: number
  weixin?: string
  friend: boolean
  avatar: string
}

export interface ScanDataType {
  qrcode: string
  status: ScanStatus
}

export interface UserLogin {
  username: string
  password: string
  remember: boolean
}

export interface UserRegister extends UserLogin {}

export interface SecretData {
  dataEncoded: string
}

export interface CookieData {
  username: string
  wxid?: string
}

export interface Stats {
  messagesReceived: number
  messagesRecalled: number
  lifetime?: Date
}
