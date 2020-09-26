export interface Stats {
  messagesReceived: number
  messagesRecalled: number
  lifetime?: Date
}

export enum TokenType {
  WEB,
  PAD,
  MOBILE,
}

export interface ServerItem {
  key: string
  token: string
  avatar: string // 用于前端显示需要
  tokenType: TokenType
  isIdle: boolean
  isFree: boolean
  isDaemon: boolean
  name: string
  expire: Date
  messagesReceived: number
  messagesRecalled: number
}

export interface ContactItem {
  key: string
  id: string
  name: string
  alias: string
  gender: number | string
  weixin?: string
  friend: boolean
  avatar: string
}

export enum ScanStatus {
  Unknown = 0,
  Cancel = 1,
  Waiting = 2,
  Scanned = 3,
  Confirmed = 4,
  Timeout = 5,
}

export interface ScanDataType {
  qrcode: string
  status: ScanStatus
}

export interface UserDataType {
  weixin: string
  id: string
  name: string
  phone: string[]
  alias: string
  avatar: string
  city: string
  friend: string
  gender: string
  province: string
  signature: string
  type: number
}

export enum ServerStatus {
  IDLE,
  RUNNING,
  DAEMON,
  ERROR,
}

export enum UserStatus {
  UNKNOWN,
  LOGIN,
  LOGOUT,
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
  user: {
    username: string
    password: string
  }
}
